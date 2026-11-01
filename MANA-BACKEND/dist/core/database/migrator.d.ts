import type { Pool } from 'pg';
export interface Migration {
    version: string;
    sql: string;
}
export declare function runMigrations(pool: Pool, migrations: readonly Migration[]): Promise<void>;
