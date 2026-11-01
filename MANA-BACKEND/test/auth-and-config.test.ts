import assert from 'node:assert/strict';
import { test } from 'node:test';
import { loadConfig } from '../src/config.js';
import { createLocalAccessToken, createTokenVerifier } from '../src/auth/tokens.js';
import { requireAuthentication } from '../src/auth/middleware.js';
import type { AppConfig } from '../src/config.js';

const localConfig: AppConfig = {
  nodeEnv: 'test',
  host: '127.0.0.1',
  port: 3000,
  corsOrigins: [],
  databaseUrl: 'postgres://test:test@localhost/test',
  databaseSsl: 'disable',
  adminSubjects: [],
  localJwtSecret: 'a-local-secret-with-more-than-thirty-two-characters',
  aiProvider: 'openai-compatible',
  aiBaseUrl: 'https://provider.example/v1',
  aiModel: 'model-a',
  aiAllowedModels: ['model-a'],
  aiTimeoutMs: 1000,
  chatRateLimitPerMinute: 10,
  chatMaxInputMessages: 10,
  chatMaxMessageCharacters: 500,
  chatMaxResponseBytes: 1024,
  logLevel: 'silent',
};

test('local access tokens are signed, scoped, and verifiable', async () => {
  const token = await createLocalAccessToken('local-user', localConfig.localJwtSecret!);
  const user = await createTokenVerifier(localConfig)(token);
  assert.deepEqual(user, { subject: 'local-user' });
  await assert.rejects(createTokenVerifier(localConfig)('invalid-token'));
});

test('bearer auth middleware accepts properly formatted Authorization headers', async () => {
  const token = await createLocalAccessToken('local-user', localConfig.localJwtSecret!);
  const calls: unknown[] = [];
  const middleware = requireAuthentication(createTokenVerifier(localConfig));
  const request = {
    header: (name: string) => name.toLowerCase() === 'authorization' ? `Bearer ${token}` : undefined,
  } as any;
  const response = {} as any;
  const next = (error?: unknown) => {
    calls.push(error ?? 'next');
  };

  await middleware(request, response, next);
  assert.deepEqual(request.auth, { subject: 'local-user' });
  assert.deepEqual(calls, ['next']);

  const rejectionRequest = {
    header: () => 'Bearer invalid-token',
  } as any;
  const rejectionCalls: unknown[] = [];
  await middleware(rejectionRequest, response, (error) => {
    rejectionCalls.push(error);
  });
  assert.equal(rejectionCalls.length, 1);
  assert.equal((rejectionCalls[0] as { code: string }).code, 'invalid_access_token');
});

test('production configuration requires OIDC and database TLS', () => {
  const environment = {
    NODE_ENV: 'production',
    DATABASE_URL: 'postgres://user:password@db.example/mana',
    DATABASE_SSL: 'require',
  } as NodeJS.ProcessEnv;
  assert.throws(() => loadConfig(environment), /requires OIDC issuer/);
});

test('empty optional OIDC environment values are treated as unset', () => {
  const config = loadConfig({
    NODE_ENV: 'development',
    DATABASE_URL: 'postgres://localhost/mana',
    LOCAL_JWT_SECRET: 'a-local-secret-with-more-than-thirty-two-characters',
    OIDC_ISSUER_URL: '',
    OIDC_JWKS_URL: '',
    OIDC_AUDIENCE: '',
  } as NodeJS.ProcessEnv);
  assert.equal(config.oidcIssuerUrl, undefined);
  assert.equal(config.oidcJwksUrl, undefined);
  assert.equal(config.oidcAudience, undefined);
});

test('production configuration rejects non-TLS database settings', () => {
  const environment = {
    NODE_ENV: 'production',
    DATABASE_URL: 'postgres://user:password@db.example/mana',
    DATABASE_SSL: 'disable',
    OIDC_ISSUER_URL: 'https://identity.example',
    OIDC_JWKS_URL: 'https://identity.example/.well-known/jwks.json',
    OIDC_AUDIENCE: 'mana-ai',
    ADMIN_SUBJECTS: 'admin-user',
  } as NodeJS.ProcessEnv;
  assert.throws(() => loadConfig(environment), /database connections must require TLS/);
});

test('production configuration requires an administrator subject allowlist', () => {
  assert.throws(() => loadConfig({
    NODE_ENV: 'production',
    DATABASE_URL: 'postgres://db.example/mana',
    DATABASE_SSL: 'require',
    OIDC_ISSUER_URL: 'https://identity.example',
    OIDC_JWKS_URL: 'https://identity.example/.well-known/jwks.json',
    OIDC_AUDIENCE: 'mana-ai',
  } as NodeJS.ProcessEnv), /requires at least one ADMIN_SUBJECTS entry/);
});

test('AI provider selection uses the matching provider API URL by default', () => {
  const common = {
    NODE_ENV: 'test',
    DATABASE_URL: 'postgres://localhost/mana',
    LOCAL_JWT_SECRET: 'a-local-secret-with-more-than-thirty-two-characters',
  };
  const defaultConfig = loadConfig(common as NodeJS.ProcessEnv);
  assert.equal(defaultConfig.aiProvider, 'openai-compatible');
  assert.equal(defaultConfig.aiBaseUrl, 'https://api.openai.com/v1');
  assert.equal(defaultConfig.aiModel, 'gpt-4o-mini');

  const geminiConfig = loadConfig({
    ...common,
    AI_PROVIDER: 'gemini',
    AI_MODEL: 'gemini-test',
    AI_ALLOWED_MODELS: 'gemini-test',
  } as NodeJS.ProcessEnv);
  assert.equal(geminiConfig.aiProvider, 'gemini');
  assert.equal(geminiConfig.aiBaseUrl, 'https://generativelanguage.googleapis.com/v1beta');
  assert.deepEqual(geminiConfig.aiAllowedModels, ['gemini-test']);
});

test('non-OpenAI providers require an explicit provider-compatible model', () => {
  assert.throws(() => loadConfig({
    NODE_ENV: 'test',
    DATABASE_URL: 'postgres://localhost/mana',
    LOCAL_JWT_SECRET: 'a-local-secret-with-more-than-thirty-two-characters',
    AI_PROVIDER: 'anthropic',
  } as NodeJS.ProcessEnv), /AI_MODEL must be set when AI_PROVIDER is anthropic/);
});

test('provider-specific defaults are validated before registry selection', () => {
  const base = {
    NODE_ENV: 'test',
    DATABASE_URL: 'postgres://localhost/mana',
    LOCAL_JWT_SECRET: 'a-local-secret-with-more-than-thirty-two-characters',
    AI_MODEL: 'provider-model',
  };
  assert.equal(loadConfig({
    ...base,
    AI_PROVIDER: 'ollama',
  } as NodeJS.ProcessEnv).aiBaseUrl, 'http://localhost:11434');
  assert.equal(loadConfig({
    ...base,
    AI_PROVIDER: 'cohere',
  } as NodeJS.ProcessEnv).aiBaseUrl, 'https://api.cohere.com');
  assert.equal(loadConfig({
    ...base,
    AI_PROVIDER: 'groq',
  } as NodeJS.ProcessEnv).aiBaseUrl, 'https://api.groq.com/openai/v1');
  assert.throws(() => loadConfig({
    ...base,
    AI_PROVIDER: 'azure-openai',
    AI_API_VERSION: '2024-10-21',
  } as NodeJS.ProcessEnv), /AI_BASE_URL must be set/u);
  assert.throws(() => loadConfig({
    ...base,
    AI_PROVIDER: 'azure-openai',
    AI_BASE_URL: 'https://mana-resource.openai.azure.com',
  } as NodeJS.ProcessEnv), /AI_API_VERSION must be set/u);
  assert.equal(loadConfig({
    ...base,
    AI_PROVIDER: 'azure-openai',
    AI_BASE_URL: 'https://mana-resource.openai.azure.com',
    AI_API_VERSION: '2024-10-21',
  } as NodeJS.ProcessEnv).aiApiVersion, '2024-10-21');
});
