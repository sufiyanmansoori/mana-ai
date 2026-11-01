import { AppError } from './app-error.js';
export declare class AuthError extends AppError {
    constructor(message?: string, status?: 401 | 403);
}
