import type { CacheManager } from '../core/cache/cache-manager.js';
export declare function cacheAsync<This, Args extends unknown[], Result>(cache: CacheManager, keyFor: (...args: Args) => string, ttlSeconds: number): (operation: (this: This, ...args: Args) => Promise<Result>) => (this: This, ...args: Args) => Promise<Result>;
