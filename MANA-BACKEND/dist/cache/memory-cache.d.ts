import type { CacheStore } from '../core/cache/cache-manager.js';
export interface MemoryCacheOptions {
    maxEntries?: number;
    now?: () => number;
}
export declare class MemoryCacheStore implements CacheStore {
    private readonly entries;
    private readonly maxEntries;
    private readonly now;
    constructor(options?: MemoryCacheOptions);
    get(key: string): Promise<string | null>;
    set(key: string, value: string, ttlSeconds: number): Promise<void>;
    delete(key: string): Promise<void>;
    clear(): void;
    get size(): number;
    private removeExpired;
}
