import type { Pool } from 'pg';
import type { VectorRecord, VectorSearchResult, VectorStore } from './vector-store.js';
export declare class PgVectorStore implements VectorStore {
    private readonly pool;
    private readonly table;
    constructor(pool: Pool, table?: string);
    upsert(records: readonly VectorRecord[]): Promise<void>;
    search(ownerSubject: string, embedding: readonly number[], limit: number): Promise<VectorSearchResult[]>;
}
