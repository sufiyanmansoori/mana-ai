export class InMemoryRateLimitStore {
    windows = new Map();
    async increment(key, windowMs, now) {
        const current = this.windows.get(key);
        if (!current || current.resetAt <= now) {
            const entry = { count: 1, resetAt: now + windowMs };
            this.windows.set(key, entry);
            if (this.windows.size > 10000) {
                for (const [entryKey, value] of this.windows) {
                    if (value.resetAt <= now)
                        this.windows.delete(entryKey);
                }
            }
            if (this.windows.size >= 10000) {
                throw new Error('In-memory rate-limit store capacity reached; configure a shared store.');
            }
            return entry;
        }
        current.count += 1;
        return current;
    }
}
export function createRateLimiter(input) {
    if (!Number.isSafeInteger(input.windowMs) || input.windowMs < 1 ||
        !Number.isSafeInteger(input.maximum) || input.maximum < 1) {
        throw new RangeError('Rate-limit window and maximum must be positive integers.');
    }
    return async (request, response, next) => {
        try {
            const result = await input.store.increment(input.key(request), input.windowMs, Date.now());
            response.setHeader('RateLimit-Limit', String(input.maximum));
            response.setHeader('RateLimit-Remaining', String(Math.max(0, input.maximum - result.count)));
            response.setHeader('RateLimit-Reset', String(Math.ceil(result.resetAt / 1000)));
            if (result.count > input.maximum) {
                response.status(429).json({ error: { code: 'rate_limit_exceeded' } });
                return;
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=rate-limiter.middleware.js.map