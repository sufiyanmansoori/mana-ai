import type { CacheManager } from '../core/cache/cache-manager.js';

export function cacheAsync<This, Args extends unknown[], Result>(
  cache: CacheManager,
  keyFor: (...args: Args) => string,
  ttlSeconds: number,
): (
  operation: (this: This, ...args: Args) => Promise<Result>,
) => (this: This, ...args: Args) => Promise<Result> {
  if (!Number.isSafeInteger(ttlSeconds) || ttlSeconds < 1) {
    throw new RangeError('Cache TTL must be a positive integer number of seconds.');
  }

  return (operation) => async function cachedOperation(this: This, ...args: Args): Promise<Result> {
    const key = keyFor(...args);
    const cached = await cache.get<Result>(key);
    if (cached !== undefined) return cached;
    const result = await operation.apply(this, args);
    await cache.set(key, result, ttlSeconds);
    return result;
  };
}
