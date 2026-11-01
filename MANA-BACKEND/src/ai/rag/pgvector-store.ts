import type { Pool } from 'pg';
import { ApiError } from '../../errors.js';
import type { VectorRecord, VectorSearchResult, VectorStore } from './vector-store.js';

export class PgVectorStore implements VectorStore {
  private readonly table: string;

  constructor(
    private readonly pool: Pool,
    table = 'ai_document_chunks',
  ) {
    if (!/^[a-z_][a-z0-9_]*$/u.test(table)) {
      throw new TypeError('The pgvector table name must be a simple SQL identifier.');
    }
    this.table = `"${table}"`;
  }

  async upsert(records: readonly VectorRecord[]): Promise<void> {
    if (records.length > 1000) throw new RangeError('A vector upsert is limited to 1000 records.');
    for (const record of records) validateRecord(record);
    if (records.length === 0) return;

    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      for (const record of records) {
        const result = await client.query(
          `INSERT INTO ${this.table}
             (id, owner_subject, document_id, content, embedding)
           VALUES ($1, $2, $3, $4, $5::vector)
           ON CONFLICT (id) DO UPDATE SET
             content = EXCLUDED.content,
             embedding = EXCLUDED.embedding
           WHERE ${this.table}.owner_subject = EXCLUDED.owner_subject
             AND ${this.table}.document_id = EXCLUDED.document_id`,
          [
            record.id,
            record.ownerSubject,
            record.documentId,
            record.content,
            toVectorLiteral(record.embedding),
          ],
        );
        if (result.rowCount === 0) {
          throw new ApiError(
            403,
            'vector_record_conflict',
            'The vector record belongs to another owner or document.',
          );
        }
      }
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async search(
    ownerSubject: string,
    embedding: readonly number[],
    limit: number,
  ): Promise<VectorSearchResult[]> {
    if (ownerSubject.trim().length === 0) throw new TypeError('ownerSubject is required.');
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      throw new RangeError('Vector search limit must be between 1 and 100.');
    }
    const vector = toVectorLiteral(embedding);
    const result = await this.pool.query<{
      id: string;
      document_id: string;
      content: string;
      score: number;
    }>(
      `SELECT id, document_id, content, 1 - (embedding <=> $1::vector) AS score
       FROM ${this.table}
       WHERE owner_subject = $2
       ORDER BY embedding <=> $1::vector
       LIMIT $3`,
      [vector, ownerSubject, limit],
    );
    return result.rows.map((row) => ({
      id: row.id,
      documentId: row.document_id,
      content: row.content,
      score: Number(row.score),
    }));
  }
}

function validateRecord(record: VectorRecord): void {
  if (
    record.id.length === 0 ||
    record.ownerSubject.length === 0 ||
    record.documentId.length === 0 ||
    record.content.length === 0
  ) {
    throw new TypeError('Vector records require an ID, owner, document ID, and content.');
  }
  toVectorLiteral(record.embedding);
}

function toVectorLiteral(values: readonly number[]): string {
  if (
    values.length === 0 ||
    values.length > 8192 ||
    values.some((value) => !Number.isFinite(value))
  ) {
    throw new ApiError(400, 'invalid_embedding', 'The embedding vector is empty or invalid.');
  }
  return `[${values.join(',')}]`;
}
