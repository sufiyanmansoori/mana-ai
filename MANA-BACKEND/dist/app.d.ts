import { type Express } from 'express';
import type { Pool } from 'pg';
import type { AppConfig } from './config.js';
import { type TokenVerifier } from './auth/tokens.js';
import { ChatRepository } from './chat/repository.js';
import { ChatService } from './chat/service.js';
import type { AppLogger } from './logger.js';
import { CatalogRepository } from './store/catalog-repository.js';
export interface AppDependencies {
    config: AppConfig;
    pool: Pool;
    logger: AppLogger;
    tokenVerifier?: TokenVerifier;
    chatRepository?: ChatRepository;
    chatService?: ChatService;
    catalogRepository?: CatalogRepository;
}
export declare function createApp(dependencies: AppDependencies): Express;
