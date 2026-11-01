export class MultiLayerCacheStore {
    local;
    remote;
    localTtlSeconds;
    constructor(local, remote, localTtlSeconds = 1) {
        this.local = local;
        this.remote = remote;
        this.localTtlSeconds = localTtlSeconds;
        if (!Number.isSafeInteger(localTtlSeconds) || localTtlSeconds < 1) {
            throw new RangeError('Local cache TTL must be a positive integer number of seconds.');
        }
    }
    async get(key) {
        const localValue = await this.local.get(key);
        if (localValue !== null)
            return localValue;
        const remoteValue = await this.remote.get(key);
        if (remoteValue !== null) {
            await this.local.set(key, remoteValue, this.localTtlSeconds);
        }
        return remoteValue;
    }
    async set(key, value, ttlSeconds) {
        await this.remote.set(key, value, ttlSeconds);
        await this.local.set(key, value, ttlSeconds);
    }
    async delete(key) {
        const results = await Promise.allSettled([
            this.local.delete(key),
            this.remote.delete(key),
        ]);
        const errors = results
            .filter((result) => result.status === 'rejected')
            .map((result) => result.reason);
        if (errors.length > 0) {
            throw new AggregateError(errors, 'Failed to delete the key from every cache layer.');
        }
    }
}
//# sourceMappingURL=multi-layer.js.map