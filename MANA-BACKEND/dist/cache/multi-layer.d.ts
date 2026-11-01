import type { CacheStore } from '../core/cache/cache-manager.js';
export declare class MultiLayerCacheStore implements CacheStore {
    private readonly local;
    private readonly remote;
    private readonly localTtlSeconds;
    constructor(local: CacheStore, remote: CacheStore, localTtlSeconds?: number);
    get(key: string): Promise<string | null>;
    set(key: string, value: string, ttlSeconds: number): Promise<void>;
    delete(key: string): Promise<void>;
}
