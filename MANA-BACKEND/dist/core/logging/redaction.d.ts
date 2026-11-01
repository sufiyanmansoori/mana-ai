export declare const SENSITIVE_LOG_PATHS: readonly ["req.headers.authorization", "req.headers.cookie", "headers.authorization", "headers.cookie", "token", "apiKey", "password", "secret"];
export declare function redactObject<T>(value: T, sensitiveKeys?: readonly string[]): T;
