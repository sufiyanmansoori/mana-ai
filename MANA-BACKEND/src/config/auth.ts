import type { ParsedEnvironment } from './env-schema.js';

export interface AuthRuntimeConfig {
  localJwtSecret?: string;
  oidcIssuerUrl?: string;
  oidcJwksUrl?: string;
  oidcAudience?: string;
  clockToleranceSeconds: number;
  adminSubjects: string[];
}

export function createAuthRuntimeConfig(env: ParsedEnvironment): AuthRuntimeConfig {
  const oidcConfigured = Boolean(env.OIDC_ISSUER_URL && env.OIDC_JWKS_URL && env.OIDC_AUDIENCE);
  if (env.NODE_ENV === 'production' && !oidcConfigured) {
    throw new Error('Production requires OIDC issuer, JWKS URL, and audience configuration.');
  }
  if (env.NODE_ENV === 'production' && env.LOCAL_JWT_SECRET) {
    throw new Error('LOCAL_JWT_SECRET must not be configured in production.');
  }
  if (env.NODE_ENV !== 'production' && !oidcConfigured && (env.LOCAL_JWT_SECRET?.length ?? 0) < 32) {
    throw new Error('Set LOCAL_JWT_SECRET to at least 32 characters for local authentication.');
  }
  if (env.NODE_ENV === 'production' && [
    env.OIDC_ISSUER_URL,
    env.OIDC_JWKS_URL,
  ].some((endpoint) => endpoint === undefined || new URL(endpoint).protocol !== 'https:')) {
    throw new Error('Production OIDC endpoints must use HTTPS.');
  }

  const adminSubjects = env.ADMIN_SUBJECTS.split(',').map((item) => item.trim()).filter(Boolean);
  if (
    new Set(adminSubjects).size !== adminSubjects.length ||
    adminSubjects.some((subject) => subject.length > 255)
  ) {
    throw new Error('ADMIN_SUBJECTS must contain unique entries of at most 255 characters.');
  }
  if (env.NODE_ENV === 'production' && adminSubjects.length === 0) {
    throw new Error('Production requires at least one ADMIN_SUBJECTS entry.');
  }
  return {
    ...(env.LOCAL_JWT_SECRET ? { localJwtSecret: env.LOCAL_JWT_SECRET } : {}),
    ...(env.OIDC_ISSUER_URL ? { oidcIssuerUrl: env.OIDC_ISSUER_URL } : {}),
    ...(env.OIDC_JWKS_URL ? { oidcJwksUrl: env.OIDC_JWKS_URL } : {}),
    ...(env.OIDC_AUDIENCE ? { oidcAudience: env.OIDC_AUDIENCE } : {}),
    clockToleranceSeconds: env.OIDC_CLOCK_TOLERANCE_SECONDS,
    adminSubjects,
  };
}
