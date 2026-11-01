export function cacheAsync(cache, keyFor, ttlSeconds) {
    if (!Number.isSafeInteger(ttlSeconds) || ttlSeconds < 1) {
        throw new RangeError('Cache TTL must be a positive integer number of seconds.');
    }
    return (operation) => async function cachedOperation(...args) {
        const key = keyFor(...args);
        const cached = await cache.get(key);
        if (cached !== undefined)
            return cached;
        const result = await operation.apply(this, args);
        await cache.set(key, result, ttlSeconds);
        return result;
    };
}
//# sourceMappingURL=cache.decorator.js.map