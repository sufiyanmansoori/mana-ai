import type { RequestHandler } from 'express';
export interface RateLimitStore {
    increment(key: string, windowMs: number, now: number): Promise<{
        count: number;
        resetAt: number;
    }>;
}
export declare class InMemoryRateLimitStore implements RateLimitStore {
    private readonly windows;
    increment(key: string, windowMs: number, now: number): Promise<{
        count: number;
        resetAt: number;
    }>;
}
export declare function createRateLimiter(input: {
    store: RateLimitStore;
    windowMs: number;
    maximum: number;
    key: (request: Parameters<RequestHandler>[0]) => string;
}): RequestHandler;
