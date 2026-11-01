import { createCacheKey } from './keys.js';
export class SessionStore {
    cache;
    options;
    constructor(cache, options) {
        this.cache = cache;
        this.options = options;
        if (!Number.isSafeInteger(options.ttlSeconds) || options.ttlSeconds < 1) {
            throw new RangeError('Session TTL must be a positive integer number of seconds.');
        }
    }
    get(sessionId) {
        return this.cache.get(this.key(sessionId));
    }
    set(sessionId, session) {
        return this.cache.set(this.key(sessionId), session, this.options.ttlSeconds);
    }
    delete(sessionId) {
        return this.cache.delete(this.key(sessionId));
    }
    key(sessionId) {
        if (sessionId.trim().length === 0)
            throw new TypeError('Session ID is required.');
        return createCacheKey('session', sessionId);
    }
}
//# sourceMappingURL=session-store.js.map