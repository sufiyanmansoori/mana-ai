import type { Request } from 'express';

export function serializeRequest(request: Pick<Request, 'method' | 'originalUrl' | 'requestId'>) {
  return { method: request.method, url: request.originalUrl, requestId: request.requestId };
}

export function serializeError(error: unknown) {
  if (error instanceof Error) return { name: error.name, message: error.message };
  return { message: String(error) };
}
