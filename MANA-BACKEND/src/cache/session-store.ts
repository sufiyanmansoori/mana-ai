import type { CacheManager } from '../core/cache/cache-manager.js';
import { createCacheKey } from './keys.js';

export interface SessionStoreOptions {
  ttlSeconds: number;
}

export class SessionStore<T> {
  constructor(
    private readonly cache: CacheManager,
    private readonly options: SessionStoreOptions,
  ) {
    if (!Number.isSafeInteger(options.ttlSeconds) || options.ttlSeconds < 1) {
      throw new RangeError('Session TTL must be a positive integer number of seconds.');
    }
  }

  get(sessionId: string): Promise<T | undefined> {
    return this.cache.get<T>(this.key(sessionId));
  }

  set(sessionId: string, session: T): Promise<void> {
    return this.cache.set(this.key(sessionId), session, this.options.ttlSeconds);
  }

  delete(sessionId: string): Promise<void> {
    return this.cache.delete(this.key(sessionId));
  }

  private key(sessionId: string): string {
    if (sessionId.trim().length === 0) throw new TypeError('Session ID is required.');
    return createCacheKey('session', sessionId);
  }
}
