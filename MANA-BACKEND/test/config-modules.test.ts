import assert from 'node:assert/strict';
import { test } from 'node:test';
import { loadConfig } from '../src/config.js';
import { EnvironmentSchema } from '../src/config/env-schema.js';
import { createCdnRuntimeConfig } from '../src/config/cdn.js';
import { parseCorsOrigins } from '../src/config/cors.js';
import { createPushRuntimeConfig } from '../src/config/push.js';
import { createRegionsRuntimeConfig } from '../src/config/regions.js';
import { createSmsRuntimeConfig } from '../src/config/sms.js';
import { createSwaggerRuntimeConfig } from '../src/config/swagger.js';
import { createMailRuntimeConfig } from '../src/config/mail.js';
import { createOAuthRuntimeConfig } from '../src/config/oauth.js';
import { createPaymentRuntimeConfig } from '../src/config/payments.js';
import { createRedisRuntimeConfig } from '../src/config/redis.js';
import { createStorageRuntimeConfig } from '../src/config/storage.js';

const baseEnvironment = {
  NODE_ENV: 'test',
  DATABASE_URL: 'postgres://localhost/mana',
  LOCAL_JWT_SECRET: 'a-local-secret-with-more-than-thirty-two-characters',
};

test('central configuration builds typed settings for every configuration area', () => {
  const config = loadConfig(baseEnvironment as NodeJS.ProcessEnv);
  assert.equal(config.appConfig?.shutdownTimeoutMs, 15000);
  assert.equal(config.databaseConfig?.poolMax, 20);
  assert.equal(config.aiConfig?.maxRetries, 0);
  assert.deepEqual(config.cdnConfig, { enabled: false, cacheControl: 'public, max-age=3600' });
  assert.equal(config.authConfig?.clockToleranceSeconds, 5);
  assert.equal(config.featureConfig?.imageGeneration, true);
  assert.equal(config.helmetConfig?.contentSecurityPolicy, true);
  assert.equal(config.i18nConfig?.defaultLocale, 'en');
  assert.equal(config.mailConfig?.provider, 'disabled');
  assert.deepEqual(config.oauthConfig, {});
  assert.equal(config.paymentConfig?.provider, 'disabled');
  assert.deepEqual(config.pushConfig, { provider: 'disabled' });
  assert.equal(config.queueConfig?.redisConfigured, false);
  assert.equal(config.rateLimitConfig?.storage, 'postgresql');
  assert.equal(config.redisConfig?.tls, false);
  assert.deepEqual(config.regionsConfig, {
    current: 'local',
    available: ['local'],
    multiRegion: false,
  });
  assert.equal(config.searchConfig?.enabled, true);
  assert.equal(config.securityConfig?.jsonLimitBytes, 1048576);
  assert.deepEqual(config.smsConfig, { provider: 'disabled' });
  assert.equal(config.storageConfig?.provider, 'local');
  assert.deepEqual(config.swaggerConfig, { enabled: false, path: '/docs' });
  assert.equal(config.vectorDbConfig?.provider, 'pgvector');
  assert.equal(config.websocketConfig?.enabled, false);
});

test('environment schema validates ranges and never includes submitted values in messages', () => {
  const result = EnvironmentSchema.safeParse({
    ...baseEnvironment,
    DATABASE_POOL_MAX: '999',
    STRIPE_SECRET_KEY: 'should-not-be-in-error-output',
  });

  assert.equal(result.success, false);
  if (!result.success) {
    assert.match(result.error.issues[0]?.path.join('.') ?? '', /DATABASE_POOL_MAX/u);
    assert.doesNotMatch(result.error.message, /should-not-be-in-error-output/u);
  }
});

test('API configuration rejects non-PostgreSQL database URLs and bounds trusted proxies', () => {
  assert.throws(() => loadConfig({
    ...baseEnvironment,
    DATABASE_URL: 'https://example.com/database',
  } as NodeJS.ProcessEnv), /DATABASE_URL/u);
  assert.throws(() => loadConfig({
    ...baseEnvironment,
    API_TRUST_PROXY_HOPS: '11',
  } as NodeJS.ProcessEnv), /API_TRUST_PROXY_HOPS/u);
  const config = loadConfig({
    ...baseEnvironment,
    API_TRUST_PROXY_HOPS: '2',
  } as NodeJS.ProcessEnv);
  assert.equal(config.securityConfig?.trustProxyHops, 2);
});

test('CORS parser rejects paths, credentials, invalid schemes and duplicate entries', () => {
  assert.deepEqual(
    parseCorsOrigins(' https://mana.example,http://localhost:5173 '),
    ['https://mana.example', 'http://localhost:5173'],
  );
  assert.throws(() => parseCorsOrigins('https://mana.example/path'), /Invalid CORS origin/u);
  assert.throws(() => parseCorsOrigins('https://user:pass@mana.example'), /Invalid CORS origin/u);
  assert.throws(() => parseCorsOrigins('https://mana.example,https://mana.example'), /unique/u);
});

test('mail settings remain disabled by default and require provider credentials when enabled', () => {
  const disabled = loadConfig(baseEnvironment as NodeJS.ProcessEnv);
  assert.deepEqual(disabled.mailConfig, { provider: 'disabled' });
  assert.throws(() => loadConfig({
    ...baseEnvironment,
    MAIL_PROVIDER: 'smtp',
    MAIL_FROM: 'noreply@mana.example',
  } as NodeJS.ProcessEnv), /SMTP_HOST and SMTP_PORT/u);
  const smtp = loadConfig({
    ...baseEnvironment,
    MAIL_PROVIDER: 'smtp',
    MAIL_FROM: 'noreply@mana.example',
    SMTP_HOST: 'mail.internal',
    SMTP_PORT: '465',
  } as NodeJS.ProcessEnv);
  assert.equal(smtp.mailConfig?.provider, 'smtp');
  if (smtp.mailConfig?.provider === 'smtp') assert.equal(smtp.mailConfig.secure, true);
});

test('OAuth provider credentials must be complete', () => {
  assert.throws(() => loadConfig({
    ...baseEnvironment,
    OAUTH_GOOGLE_CLIENT_ID: 'client-id',
  } as NodeJS.ProcessEnv), /Google OAuth requires/u);
  const configured = loadConfig({
    ...baseEnvironment,
    OAUTH_GOOGLE_CLIENT_ID: 'client-id',
    OAUTH_GOOGLE_CLIENT_SECRET: 'client-secret',
    OAUTH_GOOGLE_REDIRECT_URL: 'https://mana.example/oauth/google/callback',
  } as NodeJS.ProcessEnv);
  assert.equal(configured.oauthConfig?.google?.clientId, 'client-id');
});

test('payments require signing secrets and do not enable a provider by default', () => {
  assert.throws(() => loadConfig({
    ...baseEnvironment,
    PAYMENT_PROVIDER: 'stripe',
    STRIPE_SECRET_KEY: 'secret',
  } as NodeJS.ProcessEnv), /webhook secrets are both required/u);
  const stripe = loadConfig({
    ...baseEnvironment,
    PAYMENT_PROVIDER: 'stripe',
    STRIPE_SECRET_KEY: 'secret',
    STRIPE_WEBHOOK_SECRET: 'webhook-secret',
  } as NodeJS.ProcessEnv);
  assert.deepEqual(stripe.paymentConfig, {
    provider: 'stripe',
    secretKey: 'secret',
    webhookSecret: 'webhook-secret',
  });
});

test('production Redis requires TLS and production database requires TLS', () => {
  assert.throws(() => loadConfig({
    NODE_ENV: 'production',
    DATABASE_URL: 'postgres://db.example/mana',
    DATABASE_SSL: 'require',
    OIDC_ISSUER_URL: 'https://identity.example',
    OIDC_JWKS_URL: 'https://identity.example/jwks',
    OIDC_AUDIENCE: 'mana-api',
    ADMIN_SUBJECTS: 'admin-1',
    REDIS_URL: 'redis://redis.example:6379',
  } as NodeJS.ProcessEnv), /REDIS_URL must use rediss/u);
  assert.throws(() => loadConfig({
    NODE_ENV: 'production',
    DATABASE_URL: 'postgres://db.example/mana',
    DATABASE_SSL: 'disable',
    OIDC_ISSUER_URL: 'https://identity.example',
    OIDC_JWKS_URL: 'https://identity.example/jwks',
    OIDC_AUDIENCE: 'mana-api',
    ADMIN_SUBJECTS: 'admin-1',
  } as NodeJS.ProcessEnv), /database connections must require TLS/u);
  assert.throws(() => loadConfig({
    ...baseEnvironment,
    REDIS_URL: 'https://redis.example',
  } as NodeJS.ProcessEnv), /redis:\/\/ or rediss:\/\//u);
});

test('remote storage requires a bucket and MIME configuration is normalized', () => {
  assert.throws(() => loadConfig({
    ...baseEnvironment,
    STORAGE_PROVIDER: 's3',
  } as NodeJS.ProcessEnv), /STORAGE_BUCKET is required/u);
  const storage = createStorageRuntimeConfig(EnvironmentSchema.parse({
    ...baseEnvironment,
    STORAGE_ALLOWED_MIME_TYPES: ' image/png,application/pdf,image/png ',
  }));
  assert.deepEqual(storage.allowedMimeTypes, ['image/png', 'application/pdf']);
  assert.throws(() => createStorageRuntimeConfig(EnvironmentSchema.parse({
    ...baseEnvironment,
    STORAGE_ALLOWED_MIME_TYPES: 'not-a-mime',
  })), /valid MIME types/u);
});

test('mail and oauth helper types keep optional integrations disabled until configured', () => {
  const env = EnvironmentSchema.parse(baseEnvironment);
  assert.deepEqual(createMailRuntimeConfig(env), { provider: 'disabled' });
  assert.deepEqual(createOAuthRuntimeConfig(env), {});
  assert.deepEqual(createPaymentRuntimeConfig(env), { provider: 'disabled' });
  assert.equal(createRedisRuntimeConfig(env).url, undefined);
});

test('CDN settings reject unsafe production URLs and header injection', () => {
  const productionEnv = EnvironmentSchema.parse({
    ...baseEnvironment,
    NODE_ENV: 'production',
    CDN_BASE_URL: 'http://cdn.example',
  });
  assert.throws(() => createCdnRuntimeConfig(productionEnv), /must use HTTPS/u);
  assert.throws(() => createCdnRuntimeConfig(EnvironmentSchema.parse({
    ...baseEnvironment,
    CDN_CACHE_CONTROL: 'public\r\nset-cookie: unsafe',
  })), /single HTTP header/u);
  const cdn = createCdnRuntimeConfig(EnvironmentSchema.parse({
    ...baseEnvironment,
    CDN_BASE_URL: 'https://cdn.example/assets/',
  }));
  assert.equal(cdn.baseUrl, 'https://cdn.example/assets');
});

test('push and SMS providers require complete credentials', () => {
  const missingPushCredentials = EnvironmentSchema.parse({
    ...baseEnvironment,
    PUSH_PROVIDER: 'firebase',
  });
  assert.throws(() => createPushRuntimeConfig(missingPushCredentials), /Firebase push requires/u);
  const firebase = createPushRuntimeConfig(EnvironmentSchema.parse({
    ...baseEnvironment,
    PUSH_PROVIDER: 'firebase',
    PUSH_FIREBASE_PROJECT_ID: 'mana-project',
    PUSH_FIREBASE_CLIENT_EMAIL: 'push@mana-project.iam.gserviceaccount.com',
    PUSH_FIREBASE_PRIVATE_KEY: 'private-key',
  }));
  assert.equal(firebase.provider, 'firebase');

  assert.throws(() => createSmsRuntimeConfig(EnvironmentSchema.parse({
    ...baseEnvironment,
    SMS_PROVIDER: 'twilio',
  })), /Twilio SMS requires/u);
  const twilio = createSmsRuntimeConfig(EnvironmentSchema.parse({
    ...baseEnvironment,
    SMS_PROVIDER: 'twilio',
    SMS_TWILIO_ACCOUNT_SID: 'AC123',
    SMS_TWILIO_AUTH_TOKEN: 'token',
    SMS_TWILIO_FROM_NUMBER: '+15555550123',
  }));
  assert.equal(twilio.provider, 'twilio');
});

test('region and Swagger configuration reject inconsistent or unsafe deployment settings', () => {
  assert.throws(() => createRegionsRuntimeConfig(EnvironmentSchema.parse({
    ...baseEnvironment,
    APP_REGION: 'ap-south-1',
    APP_REGIONS: 'us-east-1,eu-west-1',
  })), /included in APP_REGIONS/u);
  assert.deepEqual(createRegionsRuntimeConfig(EnvironmentSchema.parse({
    ...baseEnvironment,
    APP_REGION: 'ap-south-1',
    APP_REGIONS: 'ap-south-1,eu-west-1',
  })).available, ['ap-south-1', 'eu-west-1']);
  assert.throws(() => createSwaggerRuntimeConfig(EnvironmentSchema.parse({
    ...baseEnvironment,
    NODE_ENV: 'production',
    SWAGGER_ENABLED: 'true',
  })), /cannot be enabled in production/u);
});
