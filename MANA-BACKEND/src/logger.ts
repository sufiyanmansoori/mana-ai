import pino from 'pino';
import { createConfiguredLogger, type LoggerRuntimeConfig } from './config/logger.js';

export function createLogger(level: string, loggerConfig?: LoggerRuntimeConfig) {
  if (loggerConfig) return createConfiguredLogger(loggerConfig);
  return pino({
    level,
    redact: {
      paths: [
        'req.headers.authorization',
        'req.headers.cookie',
        'headers.authorization',
        'headers.cookie',
        'token',
        'apiKey',
      ],
      censor: '[REDACTED]',
    },
    messageKey: 'message',
    base: { service: 'mana-ai-api' },
  });
}

export type AppLogger = ReturnType<typeof createLogger>;
