import type { ParsedEnvironment } from './env-schema.js';

export interface RateLimitConfig {
  windowMs: number;
  globalMaximum: number;
  chatMaximum: number;
  storage: 'postgresql' | 'redis';
}

export function createRateLimitConfig(env: ParsedEnvironment): RateLimitConfig {
  return {
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    globalMaximum: env.RATE_LIMIT_MAX_REQUESTS,
    chatMaximum: env.CHAT_RATE_LIMIT_PER_MINUTE,
    storage: 'postgresql',
  };
}
