import { AppError } from './app-error.js';

export function badRequest(message = 'The request is invalid.'): AppError {
  return new AppError(400, 'invalid_request', message);
}

export function notFound(message = 'The requested resource was not found.'): AppError {
  return new AppError(404, 'not_found', message);
}

export function conflict(message = 'The request conflicts with the current resource state.'): AppError {
  return new AppError(409, 'conflict', message);
}

export function tooManyRequests(message = 'Too many requests.'): AppError {
  return new AppError(429, 'rate_limit_exceeded', message);
}

export function serviceUnavailable(message = 'The service is temporarily unavailable.'): AppError {
  return new AppError(503, 'service_unavailable', message);
}
