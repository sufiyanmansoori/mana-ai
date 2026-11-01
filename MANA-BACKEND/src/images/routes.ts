import { Router } from 'express';
import type { AppConfig } from '../config.js';
import type { TokenVerifier } from '../auth/tokens.js';
import { requireAuthentication } from '../auth/middleware.js';
import type { ChatRepository } from '../chat/repository.js';
import { ApiError } from '../errors.js';
import type { ImageGenerationProvider } from './provider.js';
import { GenerateImageSchema } from './schemas.js';

export function createImageGenerationRouter(input: {
  config: AppConfig;
  verifier: TokenVerifier;
  repository: Pick<ChatRepository, 'consumeChatQuota'>;
  provider: ImageGenerationProvider;
}): Router {
  const router = Router();
  router.post('/images/generations', requireAuthentication(input.verifier), async (request, response, next) => {
    try {
      if (input.config.featureConfig?.imageGeneration === false) {
        throw new ApiError(404, 'feature_not_enabled', 'Image generation is not enabled.');
      }
      if (!input.config.imageApiKey) {
        throw new ApiError(
          503,
          'image_provider_not_configured',
          'Image generation is not configured. Add IMAGE_API_KEY or an OpenAI-compatible AI_API_KEY to the backend environment.',
        );
      }
      const body = GenerateImageSchema.parse(request.body);
      await input.repository.consumeChatQuota(
        request.auth!.subject,
        input.config.chatRateLimitPerMinute,
      );
      const image = await input.provider.generate(body);
      response.setHeader('Cache-Control', 'no-store');
      response.status(200).json({ data: image });
    } catch (error) {
      next(error);
    }
  });
  return router;
}
