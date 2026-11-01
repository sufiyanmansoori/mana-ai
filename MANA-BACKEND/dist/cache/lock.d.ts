export interface LockStore {
    acquire(key: string, token: string, leaseMs: number): Promise<boolean>;
    release(key: string, token: string): Promise<boolean>;
}
export interface LockOptions {
    leaseMs: number;
    waitMs?: number;
    retryMs?: number;
}
export declare function withLock<Result>(store: LockStore, key: string, options: LockOptions, operation: () => Promise<Result>): Promise<Result>;
