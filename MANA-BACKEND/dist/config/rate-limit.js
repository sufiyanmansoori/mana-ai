export function createRateLimitConfig(env) {
    return {
        windowMs: env.RATE_LIMIT_WINDOW_MS,
        globalMaximum: env.RATE_LIMIT_MAX_REQUESTS,
        chatMaximum: env.CHAT_RATE_LIMIT_PER_MINUTE,
        storage: 'postgresql',
    };
}
//# sourceMappingURL=rate-limit.js.map