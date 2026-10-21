import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import type { AppLogger } from '../logger.js';
import { ApiError } from '../errors.js';

export function createErrorHandler(logger: AppLogger): ErrorRequestHandler {
  return (error: unknown, request, response, _next) => {
    if (response.headersSent) {
      response.destroy();
      return;
    }

    if (error instanceof ZodError) {
      response.status(400).json({
        error: {
          code: 'validation_error',
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
          code: status === 413 ? 'request_too_large' : 'invalid_request',
          message: status === 413 ? 'The request body is too large.' : 'The request body is invalid.',
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
    response.status(500).json({
      error: {
        code: 'internal_error',
        message: 'The server could not complete the request.',
        request_id: request.requestId,
      },
    });
  };
}

function isBodyParserError(
  error: unknown,
): error is Error & { status: number; type: string } {
  return (
    error instanceof Error &&
    'status' in error &&
    typeof error.status === 'number' &&
    'type' in error &&
    typeof error.type === 'string' &&
    (
      error.type === 'entity.parse.failed' ||
      error.type === 'entity.too.large' ||
      error.type === 'request.size.invalid'
    )
  );
}
