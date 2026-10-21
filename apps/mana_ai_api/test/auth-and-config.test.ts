import assert from 'node:assert/strict';
import { test } from 'node:test';
import { loadConfig } from '../src/config.js';
import { createLocalAccessToken, createTokenVerifier } from '../src/auth/tokens.js';
import type { AppConfig } from '../src/config.js';

const localConfig: AppConfig = {
  nodeEnv: 'test',
  host: '127.0.0.1',
  port: 3000,
  corsOrigins: [],
  databaseUrl: 'postgres://test:test@localhost/test',
  databaseSsl: 'disable',
  localJwtSecret: 'a-local-secret-with-more-than-thirty-two-characters',
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

test('production configuration requires OIDC and database TLS', () => {
  const environment = {
    NODE_ENV: 'production',
    DATABASE_URL: 'postgres://user:password@db.example/mana',
    DATABASE_SSL: 'require',
  } as NodeJS.ProcessEnv;
  assert.throws(() => loadConfig(environment), /requires OIDC issuer/);
});

test('production configuration rejects non-TLS database settings', () => {
  const environment = {
    NODE_ENV: 'production',
    DATABASE_URL: 'postgres://user:password@db.example/mana',
    DATABASE_SSL: 'disable',
    OIDC_ISSUER_URL: 'https://identity.example',
    OIDC_JWKS_URL: 'https://identity.example/.well-known/jwks.json',
    OIDC_AUDIENCE: 'mana-ai',
  } as NodeJS.ProcessEnv;
  assert.throws(() => loadConfig(environment), /database connections must require TLS/);
});
