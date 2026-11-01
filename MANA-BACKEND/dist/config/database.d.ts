import { Pool } from 'pg';
export interface DatabaseRuntimeConfig {
    url: string;
    ssl: 'disable' | 'require';
    poolMax: number;
    idleTimeoutMs: number;
    connectionTimeoutMs: number;
    applicationName: string;
}
export declare function createDatabaseRuntimeConfig(env: {
    NODE_ENV: 'development' | 'test' | 'production';
    DATABASE_URL: string;
    DATABASE_SSL: 'disable' | 'require';
    DATABASE_POOL_MAX: number;
    DATABASE_IDLE_TIMEOUT_MS: number;
    DATABASE_CONNECT_TIMEOUT_MS: number;
    DATABASE_APPLICATION_NAME: string;
}): DatabaseRuntimeConfig;
export declare function createDatabasePool(config: DatabaseRuntimeConfig): Pool;
