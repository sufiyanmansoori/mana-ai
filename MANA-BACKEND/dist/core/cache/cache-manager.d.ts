export interface CacheStore {
    get(key: string): Promise<string | null>;
    set(key: string, value: string, ttlSeconds: number): Promise<void>;
    delete(key: string): Promise<void>;
}
export declare class CacheManager {
    private readonly store;
    constructor(store: CacheStore);
    get<T>(key: string): Promise<T | undefined>;
    set<T>(key: string, value: T, ttlSeconds: number): Promise<void>;
    delete(key: string): Promise<void>;
}
