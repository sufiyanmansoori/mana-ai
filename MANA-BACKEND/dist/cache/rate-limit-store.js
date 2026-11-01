export class MemoryRateLimitStore {
    now;
    maxEntries;
    windows = new Map();
    constructor(now = Date.now, maxEntries = 100_000) {
        this.now = now;
        this.maxEntries = maxEntries;
        if (!Number.isSafeInteger(maxEntries) || maxEntries < 1) {
            throw new RangeError('Rate limit maxEntries must be a positive integer.');
        }
    }
    async increment(key, windowMs) {
        if (key.trim().length === 0)
            throw new TypeError('Rate limit key is required.');
        if (!Number.isSafeInteger(windowMs) || windowMs < 1) {
            throw new RangeError('Rate limit window must be a positive integer in milliseconds.');
        }
        const currentTime = this.now();
        const current = this.windows.get(key);
        if (!current || current.resetAt <= currentTime) {
            if (!current && this.windows.size >= this.maxEntries)
                this.pruneExpired();
            if (!current && this.windows.size >= this.maxEntries) {
                throw new Error('Memory rate limit store is full; refusing to bypass rate limits.');
            }
            const next = { count: 1, resetAt: currentTime + windowMs };
            this.windows.set(key, next);
            return { ...next };
        }
        current.count += 1;
        return { ...current };
    }
    pruneExpired() {
        const currentTime = this.now();
        let removed = 0;
        for (const [key, window] of this.windows) {
            if (window.resetAt <= currentTime) {
                this.windows.delete(key);
                removed += 1;
            }
        }
        return removed;
    }
}
//# sourceMappingURL=rate-limit-store.js.map