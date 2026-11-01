import { z } from 'zod';
import { DEFAULT_LOCALE, LOCALE_TAG_PATTERN, SUPPORTED_LOCALES } from '../constants/locales.js';
import { LIMITS } from '../constants/limits.js';
import { MODEL_ID_PATTERN, DEFAULT_IMAGE_MODEL_ID } from '../constants/model-ids.js';
const optionalUrl = z.preprocess((value) => typeof value === 'string' && value.trim() === '' ? undefined : value, z.string().url().optional());
const optionalText = z.preprocess((value) => typeof value === 'string' && value.trim() === '' ? undefined : value, z.string().trim().min(1).optional());
const optionalEmail = z.preprocess((value) => typeof value === 'string' && value.trim() === '' ? undefined : value, z.string().email().optional());
const optionalModelId = z.preprocess((value) => typeof value === 'string' && value.trim() === '' ? undefined : value, z.string().trim().regex(MODEL_ID_PATTERN).optional());
const optionalAzureApiVersion = z.preprocess((value) => typeof value === 'string' && value.trim() === '' ? undefined : value, z.string().regex(/^\d{4}-\d{2}-\d{2}(?:-preview)?$/u).optional());
const booleanFromText = z.preprocess((value) => {
    if (typeof value !== 'string')
        return value;
    if (value === 'true' || value === '1')
        return true;
    if (value === 'false' || value === '0')
        return false;
    return value;
}, z.boolean());
const optionalPositiveInteger = (maximum) => z.preprocess((value) => value === '' || value === undefined ? undefined : value, z.coerce.number().int().min(1).max(maximum).optional());
export const EnvironmentSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    API_HOST: z.string().trim().min(1).default('127.0.0.1'),
    API_PORT: z.coerce.number().int()
        .min(LIMITS.apiPort.min).max(LIMITS.apiPort.max).default(LIMITS.apiPort.default),
    API_CORS_ORIGINS: z.string().default('http://localhost:8080'),
    API_SHUTDOWN_TIMEOUT_MS: z.coerce.number().int()
        .min(LIMITS.apiShutdownMs.min).max(LIMITS.apiShutdownMs.max).default(LIMITS.apiShutdownMs.default),
    API_TRUST_PROXY_HOPS: z.coerce.number().int().min(0).max(10).default(0),
    API_BODY_LIMIT_BYTES: z.coerce.number().int()
        .min(LIMITS.apiBodyBytes.min).max(LIMITS.apiBodyBytes.max).default(LIMITS.apiBodyBytes.default),
    DATABASE_URL: z.string().url().refine((value) => ['postgres:', 'postgresql:'].includes(new URL(value).protocol)),
    DATABASE_SSL: z.enum(['disable', 'require']).default('disable'),
    DATABASE_POOL_MAX: optionalPositiveInteger(LIMITS.databasePool.max).default(LIMITS.databasePool.default),
    DATABASE_IDLE_TIMEOUT_MS: z.coerce.number().int()
        .min(LIMITS.databaseIdleTimeoutMs.min).max(LIMITS.databaseIdleTimeoutMs.max)
        .default(LIMITS.databaseIdleTimeoutMs.default),
    DATABASE_CONNECT_TIMEOUT_MS: z.coerce.number().int()
        .min(LIMITS.databaseConnectTimeoutMs.min).max(LIMITS.databaseConnectTimeoutMs.max)
        .default(LIMITS.databaseConnectTimeoutMs.default),
    DATABASE_APPLICATION_NAME: z.string().trim().min(1).max(63).default('mana-ai-api'),
    LOCAL_JWT_SECRET: z.string().optional(),
    OIDC_ISSUER_URL: optionalUrl,
    OIDC_JWKS_URL: optionalUrl,
    OIDC_AUDIENCE: optionalText,
    OIDC_CLOCK_TOLERANCE_SECONDS: z.coerce.number().int().min(0).max(300).default(5),
    ADMIN_SUBJECTS: z.string().default(''),
    OAUTH_GOOGLE_CLIENT_ID: optionalText,
    OAUTH_GOOGLE_CLIENT_SECRET: z.string().optional(),
    OAUTH_GOOGLE_REDIRECT_URL: optionalUrl,
    OAUTH_APPLE_CLIENT_ID: optionalText,
    OAUTH_APPLE_CLIENT_SECRET: z.string().optional(),
    OAUTH_APPLE_REDIRECT_URL: optionalUrl,
    OAUTH_MICROSOFT_CLIENT_ID: optionalText,
    OAUTH_MICROSOFT_CLIENT_SECRET: z.string().optional(),
    OAUTH_MICROSOFT_REDIRECT_URL: optionalUrl,
    AI_PROVIDER: z.enum([
        'openai',
        'openai-compatible',
        'anthropic',
        'azure-openai',
        'cohere',
        'gemini',
        'groq',
        'mistral',
        'ollama',
    ]).default('openai-compatible'),
    AI_BASE_URL: optionalUrl,
    AI_API_VERSION: optionalAzureApiVersion,
    AI_API_KEY: z.string().optional(),
    AI_MODEL: optionalModelId,
    AI_ALLOWED_MODELS: z.string().optional(),
    AI_TIMEOUT_MS: z.coerce.number().int().min(1000).max(300000).default(90000),
    AI_MAX_RETRIES: z.coerce.number().int().min(0).max(5).default(0),
    AI_CIRCUIT_BREAKER_FAILURES: z.coerce.number().int().min(1).max(100).default(5),
    AI_CIRCUIT_BREAKER_RESET_MS: z.coerce.number().int().min(1000).max(300000).default(30000),
    IMAGE_API_KEY: z.string().optional(),
    IMAGE_BASE_URL: optionalUrl,
    IMAGE_MODEL: z.string().trim().regex(MODEL_ID_PATTERN).default(DEFAULT_IMAGE_MODEL_ID),
    IMAGE_TIMEOUT_MS: z.coerce.number().int().min(1000).max(300000).default(180000),
    CHAT_RATE_LIMIT_PER_MINUTE: z.coerce.number().int()
        .min(LIMITS.chatRequestsPerMinute.min).max(LIMITS.chatRequestsPerMinute.max)
        .default(LIMITS.chatRequestsPerMinute.default),
    CHAT_MAX_INPUT_MESSAGES: z.coerce.number().int()
        .min(LIMITS.chatInputMessages.min).max(LIMITS.chatInputMessages.max)
        .default(LIMITS.chatInputMessages.default),
    CHAT_MAX_MESSAGE_CHARACTERS: z.coerce.number().int()
        .min(LIMITS.chatMessageCharacters.min).max(LIMITS.chatMessageCharacters.max)
        .default(LIMITS.chatMessageCharacters.default),
    CHAT_MAX_RESPONSE_BYTES: z.coerce.number().int()
        .min(LIMITS.chatResponseBytes.min).max(LIMITS.chatResponseBytes.max)
        .default(LIMITS.chatResponseBytes.default),
    RATE_LIMIT_WINDOW_MS: z.coerce.number().int()
        .min(LIMITS.rateLimitWindowMs.min).max(LIMITS.rateLimitWindowMs.max)
        .default(LIMITS.rateLimitWindowMs.default),
    RATE_LIMIT_MAX_REQUESTS: optionalPositiveInteger(LIMITS.globalRateLimitRequests.max)
        .default(LIMITS.globalRateLimitRequests.default),
    LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
    LOG_REDACT_PATHS: z.string().optional(),
    SERVICE_NAME: z.string().trim().min(1).max(128).default('mana-ai-api'),
    OTEL_EXPORTER_OTLP_ENDPOINT: optionalUrl,
    METRICS_ENABLED: booleanFromText.default(false),
    APP_REGION: z.string().trim().regex(/^[a-z0-9][a-z0-9-]{0,62}$/u).default('local'),
    APP_REGIONS: z.string().default('local'),
    REDIS_URL: optionalUrl,
    REDIS_TLS_REJECT_UNAUTHORIZED: booleanFromText.default(true),
    REDIS_KEY_PREFIX: z.string().trim().max(128).default('mana-ai:'),
    QUEUE_CONCURRENCY: z.coerce.number().int().min(1).max(1000).default(10),
    CDN_BASE_URL: optionalUrl,
    CDN_CACHE_CONTROL: z.string().trim().min(1).max(256).default('public, max-age=3600'),
    HELMET_CSP_ENABLED: booleanFromText.default(true),
    HELMET_HSTS_MAX_AGE_SECONDS: z.coerce.number().int().min(0).max(63072000).default(31536000),
    PUSH_PROVIDER: z.enum(['disabled', 'firebase', 'apns']).default('disabled'),
    PUSH_FIREBASE_PROJECT_ID: optionalText,
    PUSH_FIREBASE_CLIENT_EMAIL: optionalEmail,
    PUSH_FIREBASE_PRIVATE_KEY: z.string().optional(),
    PUSH_APNS_KEY_ID: optionalText,
    PUSH_APNS_TEAM_ID: optionalText,
    PUSH_APNS_BUNDLE_ID: optionalText,
    PUSH_APNS_PRIVATE_KEY: z.string().optional(),
    PUSH_APNS_ENVIRONMENT: z.enum(['sandbox', 'production']).default('production'),
    SEARCH_ENABLED: booleanFromText.default(true),
    SEARCH_MIN_QUERY_LENGTH: z.coerce.number().int().min(1).max(256).default(2),
    SEARCH_MAX_RESULTS: z.coerce.number().int().min(1).max(100).default(25),
    SEARCH_TIMEOUT_MS: z.coerce.number().int().min(100).max(120000).default(5000),
    SMS_PROVIDER: z.enum(['disabled', 'twilio', 'sns']).default('disabled'),
    SMS_TWILIO_ACCOUNT_SID: optionalText,
    SMS_TWILIO_AUTH_TOKEN: z.string().optional(),
    SMS_TWILIO_FROM_NUMBER: optionalText,
    SMS_SENDER_ID: optionalText,
    SWAGGER_ENABLED: booleanFromText.default(false),
    SWAGGER_PATH: z.string().trim().regex(/^\/[A-Za-z0-9/_-]*$/u).default('/docs'),
    VECTOR_DB_ENABLED: booleanFromText.default(false),
    VECTOR_DB_DIMENSIONS: z.coerce.number().int().min(1).max(8192).default(1536),
    VECTOR_DB_TABLE: z.string().trim().max(63)
        .regex(/^[a-z_][a-z0-9_]*$/u).default('ai_document_chunks'),
    WEBSOCKET_ENABLED: booleanFromText.default(false),
    WEBSOCKET_MAX_CONNECTIONS: z.coerce.number().int().min(1).max(100000).default(1000),
    WEBSOCKET_HEARTBEAT_MS: z.coerce.number().int().min(1000).max(120000).default(30000),
    WEBSOCKET_MESSAGE_MAX_BYTES: z.coerce.number().int().min(1024).max(10485760).default(1048576),
    FEATURE_IMAGE_GENERATION: booleanFromText.default(true),
    FEATURE_VOICE: booleanFromText.default(false),
    FEATURE_WEB_SEARCH: booleanFromText.default(false),
    FEATURE_DOCUMENT_RAG: booleanFromText.default(false),
    DEFAULT_LOCALE: z.string().regex(LOCALE_TAG_PATTERN).default(DEFAULT_LOCALE),
    SUPPORTED_LOCALES: z.string().default(SUPPORTED_LOCALES.join(',')),
    MAIL_PROVIDER: z.enum(['disabled', 'smtp', 'sendgrid', 'ses']).default('disabled'),
    MAIL_FROM: z.string().email().optional(),
    SMTP_HOST: optionalText,
    SMTP_PORT: optionalPositiveInteger(65535),
    SMTP_USER: optionalText,
    SMTP_PASSWORD: z.string().optional(),
    SENDGRID_API_KEY: z.string().optional(),
    AWS_REGION: optionalText,
    PAYMENT_PROVIDER: z.enum(['disabled', 'stripe', 'razorpay', 'paypal']).default('disabled'),
    STRIPE_SECRET_KEY: z.string().optional(),
    STRIPE_WEBHOOK_SECRET: z.string().optional(),
    RAZORPAY_KEY_ID: optionalText,
    RAZORPAY_KEY_SECRET: z.string().optional(),
    RAZORPAY_WEBHOOK_SECRET: z.string().optional(),
    PAYPAL_CLIENT_ID: optionalText,
    PAYPAL_CLIENT_SECRET: z.string().optional(),
    PAYPAL_WEBHOOK_ID: optionalText,
    PAYPAL_ENVIRONMENT: z.enum(['sandbox', 'live']).default('sandbox'),
    STORAGE_PROVIDER: z.enum(['local', 's3', 'gcs', 'azure']).default('local'),
    STORAGE_LOCAL_DIRECTORY: z.string().trim().min(1).default('.mana-ai-uploads'),
    STORAGE_BUCKET: optionalText,
    STORAGE_MAX_UPLOAD_BYTES: z.coerce.number().int().min(1).max(1073741824).default(26214400),
    STORAGE_ALLOWED_MIME_TYPES: z.string().default('image/jpeg,image/png,image/webp,text/plain,application/pdf'),
});
export function parseEnvironment(source) {
    const result = EnvironmentSchema.safeParse(source);
    if (!result.success) {
        const fields = result.error.issues.map((issue) => {
            const name = issue.path.map(String).join('.') || 'environment';
            return `${name}: ${issue.message}`;
        });
        throw new Error(`Invalid environment configuration:\n${fields.join('\n')}`);
    }
    return result.data;
}
//# sourceMappingURL=env-schema.js.map