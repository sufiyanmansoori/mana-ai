export function createRedisRuntimeConfig(env) {
    if (env.REDIS_URL) {
        const url = new URL(env.REDIS_URL);
        if (!['redis:', 'rediss:'].includes(url.protocol)) {
            throw new Error('REDIS_URL must use redis:// or rediss://.');
        }
        if (env.NODE_ENV === 'production' && url.protocol !== 'rediss:') {
            throw new Error('Production REDIS_URL must use rediss:// TLS.');
        }
    }
    return {
        ...(env.REDIS_URL ? { url: env.REDIS_URL } : {}),
        tls: env.REDIS_URL?.startsWith('rediss://') ?? false,
        rejectUnauthorized: env.REDIS_TLS_REJECT_UNAUTHORIZED,
        keyPrefix: env.REDIS_KEY_PREFIX,
    };
}
//# sourceMappingURL=redis.js.map