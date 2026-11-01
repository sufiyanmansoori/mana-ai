import type { ErrorRequestHandler } from 'express';
import type { AppLogger } from '../logger.js';
export declare function createErrorHandler(logger: AppLogger): ErrorRequestHandler;
