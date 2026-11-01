import type { Pool, QueryResult, QueryResultRow } from 'pg';

export abstract class BaseRepository {
  protected constructor(protected readonly pool: Pool) {}

  protected query<Row extends QueryResultRow>(
    text: string,
    values: readonly unknown[] = [],
  ): Promise<QueryResult<Row>> {
    return this.pool.query<Row>(text, [...values]);
  }
}
