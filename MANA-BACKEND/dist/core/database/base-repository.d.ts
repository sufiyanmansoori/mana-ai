import type { Pool, QueryResult, QueryResultRow } from 'pg';
export declare abstract class BaseRepository {
    protected readonly pool: Pool;
    protected constructor(pool: Pool);
    protected query<Row extends QueryResultRow>(text: string, values?: readonly unknown[]): Promise<QueryResult<Row>>;
}
