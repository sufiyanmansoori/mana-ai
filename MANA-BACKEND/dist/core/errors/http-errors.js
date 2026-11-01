import { AppError } from './app-error.js';
export function badRequest(message = 'The request is invalid.') {
    return new AppError(400, 'invalid_request', message);
}
export function notFound(message = 'The requested resource was not found.') {
    return new AppError(404, 'not_found', message);
}
export function conflict(message = 'The request conflicts with the current resource state.') {
    return new AppError(409, 'conflict', message);
}
export function tooManyRequests(message = 'Too many requests.') {
    return new AppError(429, 'rate_limit_exceeded', message);
}
export function serviceUnavailable(message = 'The service is temporarily unavailable.') {
    return new AppError(503, 'service_unavailable', message);
}
//# sourceMappingURL=http-errors.js.map