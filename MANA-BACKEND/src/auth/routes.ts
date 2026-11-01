import { Router } from 'express';
import { z } from 'zod';
import type { AppConfig } from '../config.js';
import { ApiError } from '../errors.js';
import { createLocalAccessToken } from './tokens.js';

const DevTokenSchema = z.object({
  subject: z.string().trim().min(1).max(128),
});

export function createAuthRouter(config: AppConfig): Router {
  const router = Router();

  if (config.nodeEnv === 'development' && config.localJwtSecret) {
    router.post('/auth/dev-token', async (request, response, next) => {
      try {
        const input = DevTokenSchema.parse(request.body);
        const accessToken = await createLocalAccessToken(input.subject, config.localJwtSecret!);
        response.status(200).json({
          access_token: accessToken,
          token_type: 'Bearer',
          expires_in: 3600,
        });
      } catch (error) {
        next(error);
      }
    });
  } else {
    router.post('/auth/dev-token', (_request, _response, next) => {
      next(new ApiError(404, 'not_found', 'The requested endpoint was not found.'));
    });
  }

  return router;
}
