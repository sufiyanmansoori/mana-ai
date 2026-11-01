import { Router } from 'express';
import { requireAuthentication } from '../auth/middleware.js';
import { ApiError } from '../errors.js';
import { GenerateImageSchema } from './schemas.js';
export function createImageGenerationRouter(input) {
    const router = Router();
    router.post('/images/generations', requireAuthentication(input.verifier), async (request, response, next) => {
        try {
            if (input.config.featureConfig?.imageGeneration === false) {
                throw new ApiError(404, 'feature_not_enabled', 'Image generation is not enabled.');
            }
            if (!input.config.imageApiKey) {
                throw new ApiError(503, 'image_provider_not_configured', 'Image generation is not configured. Add IMAGE_API_KEY or an OpenAI-compatible AI_API_KEY to the backend environment.');
            }
            const body = GenerateImageSchema.parse(request.body);
            await input.repository.consumeChatQuota(request.auth.subject, input.config.chatRateLimitPerMinute);
            const image = await input.provider.generate(body);
            response.setHeader('Cache-Control', 'no-store');
            response.status(200).json({ data: image });
        }
        catch (error) {
            next(error);
        }
    });
    return router;
}
//# sourceMappingURL=routes.js.map