import type { NextFunction, Request, Response } from 'express';
import { ApiError } from '../errors.js';
import type { TokenVerifier } from './tokens.js';

export function requireAuthentication(verifier: TokenVerifier) {
  return async (request: Request, _response: Response, next: NextFunction) => {
    const authorization = request.header('authorization');
    const match = authorization?.match(/^Bearer\s+(.+)$/i);
    if (!match) {
      next(new ApiError(401, 'authentication_required', 'A valid bearer token is required.'));
      return;
    }

    try {
      request.auth = await verifier(match[1]!);
      next();
    } catch {
      next(new ApiError(401, 'invalid_access_token', 'The access token is invalid or expired.'));
    }
  };
}
