import { createAiRuntimeConfig } from './ai.js';
import { createAppRuntimeConfig } from './app.js';
import { createAuthRuntimeConfig } from './auth.js';
import { createCdnRuntimeConfig } from './cdn.js';
import { parseCorsOrigins } from './cors.js';
import { createDatabaseRuntimeConfig } from './database.js';
import { createFeatureConfig } from './features.js';
import { createHelmetRuntimeConfig } from './helmet.js';
import { createI18nConfig } from './i18n.js';
import { createLoggerRuntimeConfig } from './logger.js';
import { createMailRuntimeConfig } from './mail.js';
import { createOAuthRuntimeConfig } from './oauth.js';
import { createObservabilityConfig } from './observability.js';
import { createPaymentRuntimeConfig } from './payments.js';
import { createPushRuntimeConfig } from './push.js';
import { createQueueRuntimeConfig } from './queue.js';
import { createRateLimitConfig } from './rate-limit.js';
import { createRedisRuntimeConfig } from './redis.js';
import { createRegionsRuntimeConfig } from './regions.js';
import { createSearchRuntimeConfig } from './search.js';
import { createSecurityRuntimeConfig } from './security.js';
import { createSmsRuntimeConfig } from './sms.js';
import { createStorageRuntimeConfig } from './storage.js';
import { createSwaggerRuntimeConfig } from './swagger.js';
import { createVectorDbRuntimeConfig } from './vector-db.js';
import { createWebSocketRuntimeConfig } from './websocket.js';
import { parseEnvironment } from './env-schema.js';
export function loadConfig(source = process.env) {
    const env = parseEnvironment(source);
    const appConfig = createAppRuntimeConfig(env);
    const authConfig = createAuthRuntimeConfig(env);
    const databaseConfig = createDatabaseRuntimeConfig(env);
    const aiConfig = createAiRuntimeConfig(env);
    const cdnConfig = createCdnRuntimeConfig(env);
    const corsOrigins = parseCorsOrigins(env.API_CORS_ORIGINS);
    const featureConfig = createFeatureConfig(env);
    const helmetConfig = createHelmetRuntimeConfig(env);
    const i18nConfig = createI18nConfig(env);
    const loggerConfig = createLoggerRuntimeConfig(env);
    const mailConfig = createMailRuntimeConfig(env);
    const oauthConfig = createOAuthRuntimeConfig(env);
    const observabilityConfig = createObservabilityConfig(env);
    const paymentConfig = createPaymentRuntimeConfig(env);
    const pushConfig = createPushRuntimeConfig(env);
    const queueConfig = createQueueRuntimeConfig(env);
    const rateLimitConfig = createRateLimitConfig(env);
    const redisConfig = createRedisRuntimeConfig(env);
    const regionsConfig = createRegionsRuntimeConfig(env);
    const searchConfig = createSearchRuntimeConfig(env);
    const securityConfig = createSecurityRuntimeConfig(env);
    const smsConfig = createSmsRuntimeConfig(env);
    const storageConfig = createStorageRuntimeConfig(env);
    const swaggerConfig = createSwaggerRuntimeConfig(env);
    const vectorDbConfig = createVectorDbRuntimeConfig(env);
    const websocketConfig = createWebSocketRuntimeConfig(env);
    return {
        nodeEnv: appConfig.environment,
        host: appConfig.host,
        port: appConfig.port,
        corsOrigins,
        databaseUrl: databaseConfig.url,
        databaseSsl: databaseConfig.ssl,
        ...authConfig,
        aiProvider: aiConfig.provider,
        aiBaseUrl: aiConfig.baseUrl,
        ...(aiConfig.apiVersion ? { aiApiVersion: aiConfig.apiVersion } : {}),
        ...(aiConfig.apiKey ? { aiApiKey: aiConfig.apiKey } : {}),
        aiModel: aiConfig.model,
        aiAllowedModels: aiConfig.allowedModels,
        ...(aiConfig.imageApiKey ? { imageApiKey: aiConfig.imageApiKey } : {}),
        imageBaseUrl: aiConfig.imageBaseUrl,
        imageModel: aiConfig.imageModel,
        imageTimeoutMs: aiConfig.imageTimeoutMs,
        aiTimeoutMs: aiConfig.timeoutMs,
        chatRateLimitPerMinute: rateLimitConfig.chatMaximum,
        chatMaxInputMessages: env.CHAT_MAX_INPUT_MESSAGES,
        chatMaxMessageCharacters: env.CHAT_MAX_MESSAGE_CHARACTERS,
        chatMaxResponseBytes: env.CHAT_MAX_RESPONSE_BYTES,
        logLevel: loggerConfig.level,
        appConfig,
        authConfig,
        aiConfig,
        cdnConfig,
        databaseConfig,
        featureConfig,
        helmetConfig,
        i18nConfig,
        loggerConfig,
        mailConfig,
        oauthConfig,
        observabilityConfig,
        paymentConfig,
        pushConfig,
        queueConfig,
        rateLimitConfig,
        redisConfig,
        regionsConfig,
        searchConfig,
        securityConfig,
        smsConfig,
        storageConfig,
        swaggerConfig,
        vectorDbConfig,
        websocketConfig,
    };
}
export { EnvironmentSchema, parseEnvironment } from './env-schema.js';
export * from './ai.js';
export * from './app.js';
export * from './auth.js';
export * from './cdn.js';
export * from './cors.js';
export * from './database.js';
export * from './features.js';
export * from './helmet.js';
export * from './i18n.js';
export * from './logger.js';
export * from './mail.js';
export * from './oauth.js';
export * from './observability.js';
export * from './payments.js';
export * from './push.js';
export * from './queue.js';
export * from './rate-limit.js';
export * from './redis.js';
export * from './regions.js';
export * from './search.js';
export * from './security.js';
export * from './sms.js';
export * from './storage.js';
export * from './swagger.js';
export * from './vector-db.js';
export * from './websocket.js';
//# sourceMappingURL=index.js.map