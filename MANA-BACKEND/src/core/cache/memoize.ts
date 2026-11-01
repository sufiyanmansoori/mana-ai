export interface MemoizeOptions {
  ttlMs: number;
  maxEntries?: number;
}

export function memoizeAsync<Args extends readonly unknown[], Result>(
  operation: (...args: Args) => Promise<Result>,
  options: MemoizeOptions,
): (...args: Args) => Promise<Result> {
  if (!Number.isFinite(options.ttlMs) || options.ttlMs <= 0) {
    throw new RangeError('Memoize TTL must be positive.');
  }
  const maxEntries = options.maxEntries ?? 500;
  if (!Number.isSafeInteger(maxEntries) || maxEntries < 1) {
    throw new RangeError('Memoize maxEntries must be a positive integer.');
  }
  const cache = new Map<string, { expiresAt: number; promise: Promise<Result> }>();
  return (...args) => {
    const key = JSON.stringify(args);
    const existing = cache.get(key);
    if (existing && existing.expiresAt > Date.now()) return existing.promise;
    if (existing) cache.delete(key);
    while (cache.size >= maxEntries) {
      const oldest = cache.keys().next().value as string | undefined;
      if (oldest === undefined) break;
      cache.delete(oldest);
    }
    const promise = operation(...args);
    cache.set(key, { expiresAt: Date.now() + options.ttlMs, promise });
    void promise.catch(() => {
      if (cache.get(key)?.promise === promise) cache.delete(key);
    });
    return promise;
  };
}
