import type { ParsedEnvironment } from './env-schema.js';
export interface RedisRuntimeConfig {
    url?: string;
    tls: boolean;
    rejectUnauthorized: boolean;
    keyPrefix: string;
}
export declare function createRedisRuntimeConfig(env: ParsedEnvironment): RedisRuntimeConfig;
