import { Router } from 'express';
import type { AppConfig } from '../config.js';
import type { TokenVerifier } from '../auth/tokens.js';
import type { AppLogger } from '../logger.js';
import { ChatRepository } from './repository.js';
import { ChatService } from './service.js';
export interface ChatRouteDependencies {
    config: AppConfig;
    verifier: TokenVerifier;
    repository: ChatRepository;
    service: ChatService;
    logger: AppLogger;
}
export declare function createChatRouter(dependencies: ChatRouteDependencies): Router;
