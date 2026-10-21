import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import type { AppLogger } from '../logger.js';

export function requestIdAndLogging(logger: AppLogger) {
  return (request: Request, response: Response, next: NextFunction) => {
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
