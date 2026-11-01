import type { Pool } from 'pg';
export interface AdminRecord {
    id: string;
    createdAt: Date;
}
export interface AdminRecordPage {
    records: AdminRecord[];
    nextCursor: string | null;
}
export interface AdminRecordRepositoryPort {
    list(input: {
        limit: number;
        cursor?: string;
    }): Promise<AdminRecordPage>;
    getById(id: string): Promise<AdminRecord | null>;
    save(record: AdminRecord): Promise<AdminRecord>;
    delete(id: string): Promise<void>;
}
export declare class AdminRecordRepository implements AdminRecordRepositoryPort {
    private readonly pool;
    constructor(pool: Pool);
    list(input: {
        limit: number;
        cursor?: string;
    }): Promise<AdminRecordPage>;
    getById(id: string): Promise<AdminRecord | null>;
    save(record: AdminRecord): Promise<AdminRecord>;
    delete(id: string): Promise<void>;
}
