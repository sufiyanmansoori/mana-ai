import { Router } from 'express';
import type { AppConfig } from '../config.js';
import type { TokenVerifier } from '../auth/tokens.js';
import type { ChatRepository } from '../chat/repository.js';
import type { ImageGenerationProvider } from './provider.js';
export declare function createImageGenerationRouter(input: {
    config: AppConfig;
    verifier: TokenVerifier;
    repository: Pick<ChatRepository, 'consumeChatQuota'>;
    provider: ImageGenerationProvider;
}): Router;
