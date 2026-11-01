import type { ParsedEnvironment } from './env-schema.js';

export interface SecurityRuntimeConfig {
  production: boolean;
  trustProxyHops: number;
  jsonLimitBytes: number;
  corsCredentials: false;
  contentSecurityPolicy: boolean;
}

export function createSecurityRuntimeConfig(env: ParsedEnvironment): SecurityRuntimeConfig {
  return {
    production: env.NODE_ENV === 'production',
    trustProxyHops: env.API_TRUST_PROXY_HOPS,
    jsonLimitBytes: env.API_BODY_LIMIT_BYTES,
    corsCredentials: false,
    contentSecurityPolicy: true,
  };
}
