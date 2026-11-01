import pino from 'pino';
import { type LoggerRuntimeConfig } from './config/logger.js';
export declare function createLogger(level: string, loggerConfig?: LoggerRuntimeConfig): pino.Logger<never, boolean>;
export type AppLogger = ReturnType<typeof createLogger>;
