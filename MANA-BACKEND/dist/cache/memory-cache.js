export class MemoryCacheStore {
    entries = new Map();
    maxEntries;
    now;
    constructor(options = {}) {
        this.maxEntries = options.maxEntries ?? 1000;
        this.now = options.now ?? Date.now;
        if (!Number.isSafeInteger(this.maxEntries) || this.maxEntries < 1) {
            throw new RangeError('Memory cache maxEntries must be a positive integer.');
        }
    }
    async get(key) {
        validateKey(key);
        const entry = this.entries.get(key);
        if (!entry)
            return null;
        if (entry.expiresAt <= this.now()) {
            this.entries.delete(key);
            return null;
        }
        this.entries.delete(key);
        this.entries.set(key, entry);
        return entry.value;
    }
    async set(key, value, ttlSeconds) {
        validateKey(key);
        if (!Number.isSafeInteger(ttlSeconds) || ttlSeconds < 1) {
            throw new RangeError('Cache TTL must be a positive integer number of seconds.');
        }
        this.removeExpired();
        if (!this.entries.has(key)) {
            while (this.entries.size >= this.maxEntries) {
                const oldestKey = this.entries.keys().next().value;
                if (oldestKey === undefined)
                    break;
                this.entries.delete(oldestKey);
            }
        }
        this.entries.delete(key);
        this.entries.set(key, {
            value,
            expiresAt: this.now() + ttlSeconds * 1000,
        });
    }
    async delete(key) {
        validateKey(key);
        this.entries.delete(key);
    }
    clear() {
        this.entries.clear();
    }
    get size() {
        this.removeExpired();
        return this.entries.size;
    }
    removeExpired() {
        const now = this.now();
        for (const [key, entry] of this.entries) {
            if (entry.expiresAt <= now)
                this.entries.delete(key);
        }
    }
}
function validateKey(key) {
    if (key.trim().length === 0)
        throw new TypeError('Cache key is required.');
}
//# sourceMappingURL=memory-cache.js.map