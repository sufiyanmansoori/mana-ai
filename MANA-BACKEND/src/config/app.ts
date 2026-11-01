import type { ParsedEnvironment } from './env-schema.js';

export interface AppRuntimeConfig {
  environment: ParsedEnvironment['NODE_ENV'];
  host: string;
  port: number;
  shutdownTimeoutMs: number;
}

export function createAppRuntimeConfig(env: ParsedEnvironment): AppRuntimeConfig {
  return {
    environment: env.NODE_ENV,
    host: env.API_HOST,
    port: env.API_PORT,
    shutdownTimeoutMs: env.API_SHUTDOWN_TIMEOUT_MS,
  };
}
