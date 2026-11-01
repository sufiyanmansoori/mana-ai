import type { CacheManager } from '../core/cache/cache-manager.js';
export interface SessionStoreOptions {
    ttlSeconds: number;
}
export declare class SessionStore<T> {
    private readonly cache;
    private readonly options;
    constructor(cache: CacheManager, options: SessionStoreOptions);
    get(sessionId: string): Promise<T | undefined>;
    set(sessionId: string, session: T): Promise<void>;
    delete(sessionId: string): Promise<void>;
    private key;
}
