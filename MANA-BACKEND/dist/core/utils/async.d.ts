export declare function mapConcurrent<T, Result>(values: readonly T[], concurrency: number, operation: (value: T, index: number) => Promise<Result>): Promise<Result[]>;
