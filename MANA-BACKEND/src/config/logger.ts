import pino, { type LoggerOptions } from 'pino';
import type { ParsedEnvironment } from './env-schema.js';

const DEFAULT_REDACTIONS = [
  'req.headers.authorization',
  'req.headers.cookie',
  'headers.authorization',
  'headers.cookie',
  'token',
  'apiKey',
  'apiSecret',
  'password',
  'clientSecret',
  'secretKey',
  'webhookSecret',
  'accessToken',
  'refreshToken',
  '*.apiKey',
  '*.apiSecret',
  '*.clientSecret',
  '*.secretKey',
  '*.webhookSecret',
  '*.accessToken',
  '*.refreshToken',
];

export interface LoggerRuntimeConfig {
  level: ParsedEnvironment['LOG_LEVEL'];
  serviceName: string;
  redactPaths: string[];
}

export function createLoggerRuntimeConfig(env: ParsedEnvironment): LoggerRuntimeConfig {
  const custom = env.LOG_REDACT_PATHS?.split(',').map((path) => path.trim()).filter(Boolean) ?? [];
  return {
    level: env.LOG_LEVEL,
    serviceName: env.SERVICE_NAME,
    redactPaths: [...new Set([...DEFAULT_REDACTIONS, ...custom])],
  };
}

export function createConfiguredLogger(config: LoggerRuntimeConfig) {
  const options: LoggerOptions = {
    level: config.level,
    redact: { paths: config.redactPaths, censor: '[REDACTED]' },
    messageKey: 'message',
    base: { service: config.serviceName },
  };
  return pino(options);
}
