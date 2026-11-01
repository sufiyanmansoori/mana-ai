import { AppError } from './app-error.js';
export declare function badRequest(message?: string): AppError;
export declare function notFound(message?: string): AppError;
export declare function conflict(message?: string): AppError;
export declare function tooManyRequests(message?: string): AppError;
export declare function serviceUnavailable(message?: string): AppError;
