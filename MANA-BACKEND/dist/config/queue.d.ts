import type { ParsedEnvironment } from './env-schema.js';
export interface QueueRuntimeConfig {
    redisConfigured: boolean;
    concurrency: number;
    redisUrl?: string;
    prefix: string;
}
export declare function createQueueRuntimeConfig(env: ParsedEnvironment): QueueRuntimeConfig;
