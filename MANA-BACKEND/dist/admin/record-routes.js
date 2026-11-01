import { Router } from 'express';
import { requireAuthentication } from '../auth/middleware.js';
import { ERROR_CODES } from '../constants/error-codes.js';
import { PERMISSIONS } from '../constants/permissions.js';
import { resolveRole, roleHasPermission } from '../constants/roles.js';
import { ApiError } from '../errors.js';
import { AdminRecordBodySchema, AdminRecordIdSchema, AdminRecordQuerySchema, } from './record-schemas.js';
export function createAdminRecordRouter(input) {
    const router = Router();
    const authenticate = requireAuthentication(input.verifier);
    const requireAdmin = (request, _response, next) => {
        const role = resolveRole(request.auth.subject, input.config.adminSubjects);
        if (!roleHasPermission(role, PERMISSIONS.adminRecordsManage)) {
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
    router.get('/records', ...protect, async (request, response, next) => {
        try {
            const query = AdminRecordQuerySchema.parse(request.query);
            const page = await input.repository.list({
                limit: query.limit,
                ...(query.cursor ? { cursor: query.cursor } : {}),
            });
            response.json({
                data: page.records.map(serializeRecord),
                next_cursor: page.nextCursor,
            });
        }
        catch (error) {
            next(error);
        }
    });
    router.get('/records/:id', ...protect, async (request, response, next) => {
        try {
            const id = AdminRecordIdSchema.parse(request.params.id);
            const record = await input.repository.getById(id);
            if (!record) {
                throw new ApiError(404, ERROR_CODES.adminRecordNotFound, 'The admin record was not found.');
            }
            response.json({ data: serializeRecord(record) });
        }
        catch (error) {
            next(error);
        }
    });
    router.put('/records/:id', ...protect, async (request, response, next) => {
        try {
            const id = AdminRecordIdSchema.parse(request.params.id);
            const body = AdminRecordBodySchema.parse(request.body);
            const record = await input.repository.save({
                id,
                createdAt: new Date(body.createdAt),
            });
            response.json({ data: serializeRecord(record) });
        }
        catch (error) {
            next(error);
        }
    });
    router.delete('/records/:id', ...protect, async (request, response, next) => {
        try {
            const id = AdminRecordIdSchema.parse(request.params.id);
            await input.repository.delete(id);
            response.status(204).end();
        }
        catch (error) {
            next(error);
        }
    });
    return router;
}
function serializeRecord(record) {
    return {
        id: record.id,
        createdAt: record.createdAt.toISOString(),
    };
}
//# sourceMappingURL=record-routes.js.map