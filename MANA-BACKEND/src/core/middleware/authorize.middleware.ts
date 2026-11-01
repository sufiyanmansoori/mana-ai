import type { RequestHandler } from 'express';
import { ERROR_CODES } from '../../constants/error-codes.js';
import type { Permission } from '../../constants/permissions.js';
import { roleHasPermission, resolveRole } from '../../constants/roles.js';
import { ApiError } from '../../errors.js';

export function requirePermission(
  adminSubjects: readonly string[],
  permission: Permission,
): RequestHandler {
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
