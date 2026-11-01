import type { RedisRuntimeConfig } from '../../config/redis.js';
import type { CacheStore } from './cache-manager.js';
export interface RedisClientAdapter extends CacheStore {
    connect(): Promise<void>;
    close(): Promise<void>;
}
export declare function createRedisClient(config: RedisRuntimeConfig, createAdapter: (url: string, options: {
    keyPrefix: string;
}) => RedisClientAdapter): RedisClientAdapter | undefined;
