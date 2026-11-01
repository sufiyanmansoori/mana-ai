import { Router } from 'express';
import { requireAuthentication } from '../auth/middleware.js';
import { ERROR_CODES } from '../constants/error-codes.js';
import { PERMISSIONS } from '../constants/permissions.js';
import { resolveRole, roleHasPermission } from '../constants/roles.js';
import { ApiError } from '../errors.js';
import { AdminFeatureFlagRepository, } from './feature-flag-repository.js';
import { CreateFeatureFlagSchema, FeatureFlagAuditQuerySchema, FeatureFlagKeyParamSchema, UpdateFeatureFlagSchema, } from './schemas.js';
export function createAdminRouter(input) {
    const router = Router();
    const authenticate = requireAuthentication(input.verifier);
    const requireAdmin = (request, _response, next) => {
        const role = resolveRole(request.auth.subject, input.config.adminSubjects);
        if (!roleHasPermission(role, PERMISSIONS.adminFeatureFlagsManage)) {
            next(new ApiError(403, ERROR_CODES.adminAccessRequired, 'Administrator access is required.'));
            return;
        }
        next();
    };
    const protect = [authenticate, requireAdmin];
    router.use((_request, response, next) => {
        response.setHeader('Cache-Control', 'no-store');
        next();
    });
    router.get('/feature-flags', ...protect, async (_request, response, next) => {
        try {
            response.json({ data: await input.repository.list() });
        }
        catch (error) {
            next(error);
        }
    });
    router.get('/feature-flags/audit', ...protect, async (request, response, next) => {
        try {
            const { limit } = FeatureFlagAuditQuerySchema.parse(request.query);
            response.json({ data: await input.repository.listAudit(limit) });
        }
        catch (error) {
            next(error);
        }
    });
    router.post('/feature-flags', ...protect, async (request, response, next) => {
        try {
            const inputFlag = CreateFeatureFlagSchema.parse(request.body);
            const data = await input.repository.create({
                ...inputFlag,
                actorSubject: request.auth.subject,
            });
            response.status(201).json({ data });
        }
        catch (error) {
            next(mapUniqueConflict(error));
        }
    });
    router.patch('/feature-flags/:key', ...protect, async (request, response, next) => {
        try {
            const { key } = FeatureFlagKeyParamSchema.parse(request.params);
            const { enabled } = UpdateFeatureFlagSchema.parse(request.body);
            const data = await input.repository.setEnabled({
                key,
                enabled,
                actorSubject: request.auth.subject,
            });
            response.json({ data });
        }
        catch (error) {
            next(error);
        }
    });
    router.delete('/feature-flags/:key', ...protect, async (request, response, next) => {
        try {
            const { key } = FeatureFlagKeyParamSchema.parse(request.params);
            await input.repository.delete({
                key,
                actorSubject: request.auth.subject,
            });
            response.status(204).end();
        }
        catch (error) {
            next(error);
        }
    });
    return router;
}
function mapUniqueConflict(error) {
    if (error !== null &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === '23505') {
        return new ApiError(409, 'feature_flag_key_conflict', 'That feature flag key already exists.');
    }
    return error;
}
export { AdminFeatureFlagRepository };
//# sourceMappingURL=routes.js.map