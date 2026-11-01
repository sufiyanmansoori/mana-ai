import { ZodError } from 'zod';
import { ApiError } from '../errors.js';
import { ERROR_CODES } from '../constants/error-codes.js';
import { HTTP_STATUS } from '../constants/http-status.js';
export function createErrorHandler(logger) {
    return (error, request, response, _next) => {
        if (response.headersSent) {
            response.destroy();
            return;
        }
        if (error instanceof ZodError) {
            response.status(HTTP_STATUS.BAD_REQUEST).json({
                error: {
                    code: ERROR_CODES.validationError,
                    message: 'The request contains invalid fields.',
                    request_id: request.requestId,
                },
            });
            return;
        }
        if (isBodyParserError(error)) {
            const status = error.status;
            response.status(status).json({
                error: {
                    code: status === HTTP_STATUS.PAYLOAD_TOO_LARGE
                        ? ERROR_CODES.requestTooLarge
                        : ERROR_CODES.invalidRequest,
                    message: status === HTTP_STATUS.PAYLOAD_TOO_LARGE
                        ? 'The request body is too large.'
                        : 'The request body is invalid.',
                    request_id: request.requestId,
                },
            });
            return;
        }
        if (error instanceof ApiError) {
            if (error.status >= 500) {
                logger.error({
                    requestId: request.requestId,
                    status: error.status,
                    code: error.code,
                }, 'Request dependency failed');
            }
            response.status(error.status).json({
                error: {
                    code: error.code,
                    message: error.message,
                    request_id: request.requestId,
                },
            });
            return;
        }
        logger.error({ err: error, requestId: request.requestId }, 'Unhandled request error');
        response.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            error: {
                code: ERROR_CODES.internalError,
                message: 'The server could not complete the request.',
                request_id: request.requestId,
            },
        });
    };
}
function isBodyParserError(error) {
    return (error instanceof Error &&
        'status' in error &&
        typeof error.status === 'number' &&
        'type' in error &&
        typeof error.type === 'string' &&
        (error.type === 'entity.parse.failed' ||
            error.type === 'entity.too.large' ||
            error.type === 'request.size.invalid'));
}
//# sourceMappingURL=errors.js.map