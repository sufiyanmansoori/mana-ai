import { z } from 'zod';
const EnvironmentSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    API_HOST: z.string().default('127.0.0.1'),
    API_PORT: z.coerce.number().int().min(1).max(65535).default(3000),
    API_CORS_ORIGINS: z.string().default('http://localhost:8080'),
    DATABASE_URL: z.string().url(),
    DATABASE_SSL: z.enum(['disable', 'require']).default('disable'),
    LOCAL_JWT_SECRET: z.string().optional(),
    OIDC_ISSUER_URL: z.string().url().optional(),
    OIDC_JWKS_URL: z.string().url().optional(),
    OIDC_AUDIENCE: z.string().min(1).optional(),
    AI_BASE_URL: z.string().url().default('https://api.openai.com/v1'),
    AI_API_KEY: z.string().optional(),
    AI_MODEL: z.string().min(1).default('gpt-4o-mini'),
    AI_ALLOWED_MODELS: z.string().default('gpt-4o-mini'),
    AI_TIMEOUT_MS: z.coerce.number().int().min(1000).max(300000).default(90000),
    CHAT_RATE_LIMIT_PER_MINUTE: z.coerce.number().int().min(1).max(1000).default(20),
    CHAT_MAX_INPUT_MESSAGES: z.coerce.number().int().min(1).max(100).default(100),
    CHAT_MAX_MESSAGE_CHARACTERS: z.coerce.number().int().min(1).max(100000).default(20000),
    CHAT_MAX_RESPONSE_BYTES: z.coerce.number().int().min(1024).max(10485760).default(1048576),
    LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
});
function parseOrigins(value) {
    return value.split(',').map((item) => {
        const origin = item.trim();
        const url = new URL(origin);
        if (!['http:', 'https:'].includes(url.protocol) ||
            url.origin !== origin ||
            url.username ||
            url.password) {
            throw new Error(`Invalid CORS origin: ${origin}`);
        }
        return origin;
    }).filter(Boolean);
}
export function loadConfig(source = process.env) {
    const parsed = EnvironmentSchema.parse(source);
    const isOidcConfigured = Boolean(parsed.OIDC_ISSUER_URL && parsed.OIDC_JWKS_URL && parsed.OIDC_AUDIENCE);
    if (parsed.NODE_ENV === 'production' && !isOidcConfigured) {
        throw new Error('Production requires OIDC issuer, JWKS URL, and audience configuration.');
    }
    if (parsed.NODE_ENV === 'production' && parsed.LOCAL_JWT_SECRET) {
        throw new Error('LOCAL_JWT_SECRET must not be configured in production.');
    }
    if (parsed.NODE_ENV !== 'production' &&
        !isOidcConfigured &&
        (parsed.LOCAL_JWT_SECRET?.length ?? 0) < 32) {
        throw new Error('Set LOCAL_JWT_SECRET to at least 32 characters for local authentication.');
    }
    if (parsed.NODE_ENV === 'production' && parsed.DATABASE_SSL !== 'require') {
        throw new Error('Production database connections must require TLS.');
    }
    if (parsed.NODE_ENV === 'production' &&
        [parsed.OIDC_ISSUER_URL, parsed.OIDC_JWKS_URL].some((value) => value !== undefined && new URL(value).protocol !== 'https:')) {
        throw new Error('Production OIDC endpoints must use HTTPS.');
    }
    const aiUrl = new URL(parsed.AI_BASE_URL);
    if (aiUrl.protocol !== 'https:' &&
        !(parsed.NODE_ENV !== 'production' && ['localhost', '127.0.0.1'].includes(aiUrl.hostname))) {
        throw new Error('AI_BASE_URL must use HTTPS outside local development.');
    }
    const allowedModels = parsed.AI_ALLOWED_MODELS.split(',').map((model) => model.trim()).filter(Boolean);
    if (!allowedModels.includes(parsed.AI_MODEL)) {
        throw new Error('AI_MODEL must be present in AI_ALLOWED_MODELS.');
    }
    return {
        nodeEnv: parsed.NODE_ENV,
        host: parsed.API_HOST,
        port: parsed.API_PORT,
        corsOrigins: parseOrigins(parsed.API_CORS_ORIGINS),
        databaseUrl: parsed.DATABASE_URL,
        databaseSsl: parsed.DATABASE_SSL,
        ...(parsed.LOCAL_JWT_SECRET ? { localJwtSecret: parsed.LOCAL_JWT_SECRET } : {}),
        ...(parsed.OIDC_ISSUER_URL ? { oidcIssuerUrl: parsed.OIDC_ISSUER_URL } : {}),
        ...(parsed.OIDC_JWKS_URL ? { oidcJwksUrl: parsed.OIDC_JWKS_URL } : {}),
        ...(parsed.OIDC_AUDIENCE ? { oidcAudience: parsed.OIDC_AUDIENCE } : {}),
        aiBaseUrl: parsed.AI_BASE_URL,
        ...(parsed.AI_API_KEY ? { aiApiKey: parsed.AI_API_KEY } : {}),
        aiModel: parsed.AI_MODEL,
        aiAllowedModels: allowedModels,
        aiTimeoutMs: parsed.AI_TIMEOUT_MS,
        chatRateLimitPerMinute: parsed.CHAT_RATE_LIMIT_PER_MINUTE,
        chatMaxInputMessages: parsed.CHAT_MAX_INPUT_MESSAGES,
        chatMaxMessageCharacters: parsed.CHAT_MAX_MESSAGE_CHARACTERS,
        chatMaxResponseBytes: parsed.CHAT_MAX_RESPONSE_BYTES,
        logLevel: parsed.LOG_LEVEL,
    };
}
//# sourceMappingURL=config.js.map