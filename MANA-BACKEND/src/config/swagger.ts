import type { ParsedEnvironment } from './env-schema.js';

export interface SwaggerRuntimeConfig {
  enabled: boolean;
  path: string;
}

export function createSwaggerRuntimeConfig(env: ParsedEnvironment): SwaggerRuntimeConfig {
  if (env.NODE_ENV === 'production' && env.SWAGGER_ENABLED) {
    throw new Error('Swagger UI cannot be enabled in production without an authenticated documentation route.');
  }
  return {
    enabled: env.SWAGGER_ENABLED,
    path: env.SWAGGER_PATH.replace(/\/+$/u, '') || '/',
  };
}
