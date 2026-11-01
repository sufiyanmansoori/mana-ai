import type { Pool, PoolClient } from 'pg';
import { type AdminAuditAction } from '../constants/events.js';
export interface AdminFeatureFlag {
    key: string;
    description: string;
    enabled: boolean;
    created_at: Date;
    updated_at: Date;
    updated_by: string;
}
export interface AdminFeatureFlagAuditEntry {
    id: string;
    key: string;
    action: AdminAuditAction;
    actor_subject: string;
    previous_value: Record<string, unknown> | null;
    new_value: Record<string, unknown> | null;
    occurred_at: Date;
}
export interface AdminFeatureFlagRepositoryPort {
    list(): Promise<AdminFeatureFlag[]>;
    listAudit(limit: number): Promise<AdminFeatureFlagAuditEntry[]>;
    create(input: {
        key: string;
        description: string;
        enabled: boolean;
        actorSubject: string;
    }): Promise<AdminFeatureFlag>;
    setEnabled(input: {
        key: string;
        enabled: boolean;
        actorSubject: string;
    }): Promise<AdminFeatureFlag>;
    delete(input: {
        key: string;
        actorSubject: string;
    }): Promise<void>;
}
export declare class AdminFeatureFlagRepository implements AdminFeatureFlagRepositoryPort {
    private readonly pool;
    constructor(pool: Pool);
    list(): Promise<AdminFeatureFlag[]>;
    listAudit(limit: number): Promise<AdminFeatureFlagAuditEntry[]>;
    create(input: {
        key: string;
        description: string;
        enabled: boolean;
        actorSubject: string;
    }): Promise<AdminFeatureFlag>;
    setEnabled(input: {
        key: string;
        enabled: boolean;
        actorSubject: string;
    }): Promise<AdminFeatureFlag>;
    delete(input: {
        key: string;
        actorSubject: string;
    }): Promise<void>;
    _inTransaction<T>(operation: (client: PoolClient) => Promise<T>): Promise<T>;
    _writeAudit(client: PoolClient, entry: {
        key: string;
        action: AdminAuditAction;
        actorSubject: string;
        previousValue?: Record<string, unknown>;
        newValue?: Record<string, unknown>;
    }): Promise<void>;
    _auditValue(flag: AdminFeatureFlag): Record<string, unknown>;
}
