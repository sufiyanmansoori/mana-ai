export interface CacheStore {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttlSeconds: number): Promise<void>;
  delete(key: string): Promise<void>;
}

export class CacheManager {
  constructor(private readonly store: CacheStore) {}

  async get<T>(key: string): Promise<T | undefined> {
    const value = await this.store.get(key);
    if (value === null) return undefined;
    return JSON.parse(value) as T;
  }

  async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    if (!Number.isSafeInteger(ttlSeconds) || ttlSeconds <= 0) {
      throw new RangeError('Cache TTL must be a positive integer number of seconds.');
    }
    await this.store.set(key, JSON.stringify(value), ttlSeconds);
  }

  delete(key: string): Promise<void> {
    return this.store.delete(key);
  }
}
