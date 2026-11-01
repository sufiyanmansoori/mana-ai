export interface RateLimitWindow {
    count: number;
    resetAt: number;
}
export interface RateLimitStore {
    increment(key: string, windowMs: number): Promise<RateLimitWindow>;
}
export declare class MemoryRateLimitStore implements RateLimitStore {
    private readonly now;
    private readonly maxEntries;
    private readonly windows;
    constructor(now?: () => number, maxEntries?: number);
    increment(key: string, windowMs: number): Promise<RateLimitWindow>;
    pruneExpired(): number;
}
