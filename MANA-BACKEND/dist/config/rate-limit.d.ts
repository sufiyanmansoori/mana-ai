import type { ParsedEnvironment } from './env-schema.js';
export interface RateLimitConfig {
    windowMs: number;
    globalMaximum: number;
    chatMaximum: number;
    storage: 'postgresql' | 'redis';
}
export declare function createRateLimitConfig(env: ParsedEnvironment): RateLimitConfig;
