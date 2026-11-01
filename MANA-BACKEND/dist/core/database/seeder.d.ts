import type { Pool } from 'pg';
export declare function runSeeder(pool: Pool, sql: string): Promise<void>;
