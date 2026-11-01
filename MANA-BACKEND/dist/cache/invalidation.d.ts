export interface CacheTagIndex {
    add(tag: string, key: string): Promise<void>;
    keys(tag: string): Promise<readonly string[]>;
    remove(tag: string, key: string): Promise<void>;
}
export interface CacheKeyDeleter {
    delete(key: string): Promise<void>;
}
export declare class MemoryCacheTagIndex implements CacheTagIndex {
    private readonly entries;
    add(tag: string, key: string): Promise<void>;
    keys(tag: string): Promise<readonly string[]>;
    remove(tag: string, key: string): Promise<void>;
}
export declare function invalidateTag(tag: string, index: CacheTagIndex, cache: CacheKeyDeleter): Promise<number>;
