export declare function omit<T extends Record<string, unknown>, K extends keyof T>(input: T, keys: readonly K[]): Omit<T, K>;
export declare function isPlainObject(value: unknown): value is Record<string, unknown>;
