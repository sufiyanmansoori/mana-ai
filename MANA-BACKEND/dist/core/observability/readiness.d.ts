import type { Pool } from 'pg';
export declare function checkDatabaseReadiness(pool: Pool): Promise<void>;
