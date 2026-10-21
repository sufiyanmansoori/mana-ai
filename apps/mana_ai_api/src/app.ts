import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import type { Pool } from 'pg';
import type { AppConfig } from './config.js';
import { createAuthRouter } from './auth/routes.js';
import { createTokenVerifier, type TokenVerifier } from './auth/tokens.js';
import { createChatRouter } from './chat/routes.js';
import { OpenAiCompatibleProvider } from './chat/openai-compatible-provider.js';
import { ChatRepository } from './chat/repository.js';
import { ChatService } from './chat/service.js';
import { ApiError } from './errors.js';
import { createErrorHandler } from './middleware/errors.js';
import { requestIdAndLogging } from './middleware/request-id.js';
import type { AppLogger } from './logger.js';
import { createPreferencesRouter } from './preferences/routes.js';
import { PreferencesRepository } from './preferences/repository.js';

export interface AppDependencies {
  config: AppConfig;
  pool: Pool;
  logger: AppLogger;
  tokenVerifier?: TokenVerifier;
  chatRepository?: ChatRepository;
  chatService?: ChatService;
}

export function createApp(dependencies: AppDependencies): Express {
  const { config, pool, logger } = dependencies;
  const verifier = dependencies.tokenVerifier ?? createTokenVerifier(config);
  const repository = dependencies.chatRepository ?? new ChatRepository(pool);
  const service = dependencies.chatService ?? new ChatService(
    config,
    repository,
    new OpenAiCompatibleProvider(config),
  );
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }));
  app.use(cors({
    origin(origin, callback) {
      if (!origin || config.corsOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new ApiError(403, 'origin_not_allowed', 'This application origin is not allowed.'));
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['authorization', 'content-type', 'x-request-id'],
    exposedHeaders: ['x-request-id', 'x-conversation-id'],
    maxAge: 600,
  }));
  app.use(requestIdAndLogging(logger));
  app.use(express.json({ limit: '1mb', strict: true }));

  app.get('/health/live', (_request, response) => {
    response.status(200).json({ status: 'ok' });
  });
  app.get('/health/ready', async (_request, response) => {
    try {
      await pool.query('SELECT 1');
      response.status(200).json({ status: 'ready' });
    } catch (error) {
      logger.error({ err: error, requestId: _request.requestId }, 'Readiness probe failed');
      response.status(503).json({ status: 'not_ready' });
    }
  });

  app.use('/v1', createAuthRouter(config));
  app.use('/v1', createPreferencesRouter({
    config,
    verifier,
    repository: new PreferencesRepository(pool),
  }));
  app.use('/v1', createChatRouter({
    config,
    verifier,
    repository,
    service,
    logger,
  }));
  app.use((_request, _response, next) => {
    next(new ApiError(404, 'not_found', 'The requested endpoint was not found.'));
  });
  app.use(createErrorHandler(logger));
  return app;
}
