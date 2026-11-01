export function createQueueRuntimeConfig(env) {
    if (env.QUEUE_CONCURRENCY > 1 && !env.REDIS_URL) {
        return { redisConfigured: false, concurrency: 1, prefix: env.REDIS_KEY_PREFIX };
    }
    return {
        redisConfigured: Boolean(env.REDIS_URL),
        concurrency: env.REDIS_URL ? env.QUEUE_CONCURRENCY : 1,
        ...(env.REDIS_URL ? { redisUrl: env.REDIS_URL } : {}),
        prefix: env.REDIS_KEY_PREFIX,
    };
}
//# sourceMappingURL=queue.js.map