import type { ParsedEnvironment } from './env-schema.js';

export interface HelmetRuntimeConfig {
  contentSecurityPolicy: boolean;
  hstsMaxAgeSeconds: number;
}

export function createHelmetRuntimeConfig(env: ParsedEnvironment): HelmetRuntimeConfig {
  return {
    contentSecurityPolicy: env.HELMET_CSP_ENABLED,
    hstsMaxAgeSeconds: env.HELMET_HSTS_MAX_AGE_SECONDS,
  };
}
