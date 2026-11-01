import type { CacheStore } from '../core/cache/cache-manager.js';

export class MultiLayerCacheStore implements CacheStore {
  constructor(
    private readonly local: CacheStore,
    private readonly remote: CacheStore,
    private readonly localTtlSeconds = 1,
  ) {
    if (!Number.isSafeInteger(localTtlSeconds) || localTtlSeconds < 1) {
      throw new RangeError('Local cache TTL must be a positive integer number of seconds.');
    }
  }

  async get(key: string): Promise<string | null> {
    const localValue = await this.local.get(key);
    if (localValue !== null) return localValue;
    const remoteValue = await this.remote.get(key);
    if (remoteValue !== null) {
      await this.local.set(key, remoteValue, this.localTtlSeconds);
    }
    return remoteValue;
  }

  async set(key: string, value: string, ttlSeconds: number): Promise<void> {
    await this.remote.set(key, value, ttlSeconds);
    await this.local.set(key, value, ttlSeconds);
  }

  async delete(key: string): Promise<void> {
    const results = await Promise.allSettled([
      this.local.delete(key),
      this.remote.delete(key),
    ]);
    const errors = results
      .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
      .map((result) => result.reason);
    if (errors.length > 0) {
      throw new AggregateError(errors, 'Failed to delete the key from every cache layer.');
    }
  }
}
