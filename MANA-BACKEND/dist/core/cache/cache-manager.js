export class CacheManager {
    store;
    constructor(store) {
        this.store = store;
    }
    async get(key) {
        const value = await this.store.get(key);
        if (value === null)
            return undefined;
        return JSON.parse(value);
    }
    async set(key, value, ttlSeconds) {
        if (!Number.isSafeInteger(ttlSeconds) || ttlSeconds <= 0) {
            throw new RangeError('Cache TTL must be a positive integer number of seconds.');
        }
        await this.store.set(key, JSON.stringify(value), ttlSeconds);
    }
    delete(key) {
        return this.store.delete(key);
    }
}
//# sourceMappingURL=cache-manager.js.map