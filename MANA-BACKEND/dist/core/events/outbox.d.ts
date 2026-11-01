import type { Pool } from 'pg';
export declare class PostgresOutbox {
    private readonly pool;
    constructor(pool: Pool);
    append(event: {
        id: string;
        name: string;
        payload: unknown;
    }): Promise<void>;
}
