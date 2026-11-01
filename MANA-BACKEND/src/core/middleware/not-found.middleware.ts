import type { RequestHandler } from 'express';
import { ApiError } from '../../errors.js';

export const notFoundMiddleware: RequestHandler = (_request, _response, next) => {
  next(new ApiError(404, 'not_found', 'The requested endpoint was not found.'));
};
