import { Router } from 'express';
import type { AppConfig } from '../config.js';
import { ApiError } from '../errors.js';
import { requireAuthentication } from '../auth/middleware.js';
import type { TokenVerifier } from '../auth/tokens.js';
import { PreferencesRepository } from './repository.js';
import { UpdatePreferencesSchema } from './schemas.js';

export function createPreferencesRouter(input: {
  config: AppConfig;
  verifier: TokenVerifier;
  repository: PreferencesRepository;
}): Router {
  const router = Router();
  const authenticate = requireAuthentication(input.verifier);

  router.get('/preferences', authenticate, async (request, response, next) => {
    try {
      const data = await input.repository.get(
        request.auth!.subject,
        input.config.aiModel,
      );
      response.json({ data });
    } catch (error) {
      next(error);
    }
  });

  router.patch('/preferences', authenticate, async (request, response, next) => {
    try {
      const preferences = UpdatePreferencesSchema.parse(request.body);
      if (
        preferences.default_model !== undefined &&
        !input.config.aiAllowedModels.includes(preferences.default_model)
      ) {
        throw new ApiError(
          400,
          'unsupported_model',
          'The requested default model is not enabled for this API.',
        );
      }
      const data = await input.repository.update(
        request.auth!.subject,
        input.config.aiModel,
        preferences,
      );
      response.json({ data });
    } catch (error) {
      next(error);
    }
  });

  router.delete('/preferences', authenticate, async (request, response, next) => {
    try {
      await input.repository.reset(request.auth!.subject);
      response.status(204).end();
    } catch (error) {
      next(error);
    }
  });

  return router;
}
