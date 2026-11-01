export interface RetryPolicy {
    attempts: number;
    initialDelayMs: number;
    maxDelayMs: number;
    factor: number;
}
export declare function retryDelay(attempt: number, policy: RetryPolicy): number;
export declare function retry<T>(operation: (attempt: number) => Promise<T>, policy: RetryPolicy, shouldRetry?: (error: unknown) => boolean): Promise<T>;
