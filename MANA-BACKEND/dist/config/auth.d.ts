import type { ParsedEnvironment } from './env-schema.js';
export interface AuthRuntimeConfig {
    localJwtSecret?: string;
    oidcIssuerUrl?: string;
    oidcJwksUrl?: string;
    oidcAudience?: string;
    clockToleranceSeconds: number;
    adminSubjects: string[];
}
export declare function createAuthRuntimeConfig(env: ParsedEnvironment): AuthRuntimeConfig;
