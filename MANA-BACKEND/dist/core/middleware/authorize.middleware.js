import { ERROR_CODES } from '../../constants/error-codes.js';
import { roleHasPermission, resolveRole } from '../../constants/roles.js';
import { ApiError } from '../../errors.js';
export function requirePermission(adminSubjects, permission) {
    return (request, _response, next) => {
        if (!request.auth) {
            next(new ApiError(401, 'authentication_required', 'Authentication is required.'));
            return;
        }
        const role = resolveRole(request.auth.subject, adminSubjects);
        if (!roleHasPermission(role, permission)) {
            next(new ApiError(403, ERROR_CODES.adminAccessRequired, 'The required permission is missing.'));
            return;
        }
        next();
    };
}
//# sourceMappingURL=authorize.middleware.js.map