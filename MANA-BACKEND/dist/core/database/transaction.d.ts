import type { Pool, PoolClient } from 'pg';
export declare function withTransaction<T>(pool: Pool, operation: (client: PoolClient) => Promise<T>): Promise<T>;
