import { AppError } from './app-error.js';
export class AuthError extends AppError {
    constructor(message = 'Authentication is required.', status = 401) {
        super(status, status === 401 ? 'authentication_required' : 'admin_access_required', message);
        this.name = 'AuthError';
    }
}
//# sourceMappingURL=auth-error.js.map