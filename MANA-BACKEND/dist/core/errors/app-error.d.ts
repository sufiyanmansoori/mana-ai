export declare class AppError extends Error {
    readonly status: number;
    readonly code: string;
    constructor(status: number, code: string, message: string, options?: ErrorOptions);
}
