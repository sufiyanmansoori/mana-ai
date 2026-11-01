import { ApiError } from '../../errors.js';
export const notFoundMiddleware = (_request, _response, next) => {
    next(new ApiError(404, 'not_found', 'The requested endpoint was not found.'));
};
//# sourceMappingURL=not-found.middleware.js.map