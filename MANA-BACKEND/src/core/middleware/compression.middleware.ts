import type { RequestHandler } from 'express';

export function compressionMiddleware(adapter: RequestHandler): RequestHandler {
  if (typeof adapter !== 'function') throw new TypeError('Provide a configured compression middleware adapter.');
  return adapter;
}
