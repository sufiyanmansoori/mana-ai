export interface MemoizeOptions {
    ttlMs: number;
    maxEntries?: number;
}
export declare function memoizeAsync<Args extends readonly unknown[], Result>(operation: (...args: Args) => Promise<Result>, options: MemoizeOptions): (...args: Args) => Promise<Result>;
