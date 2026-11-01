import { randomUUID } from 'node:crypto';
export function requestIdAndLogging(logger) {
    return (request, response, next) => {
        const requestId = randomUUID();
        const startedAt = Date.now();
        request.requestId = requestId;
        response.setHeader('x-request-id', requestId);
        response.on('finish', () => {
            logger.info({
                requestId,
                method: request.method,
                path: request.path,
                statusCode: response.statusCode,
                durationMs: Date.now() - startedAt,
            }, 'HTTP request completed');
        });
        next();
    };
}
//# sourceMappingURL=request-id.js.map