import type { ParsedEnvironment } from './env-schema.js';
export interface SecurityRuntimeConfig {
    production: boolean;
    trustProxyHops: number;
    jsonLimitBytes: number;
    corsCredentials: false;
    contentSecurityPolicy: boolean;
}
export declare function createSecurityRuntimeConfig(env: ParsedEnvironment): SecurityRuntimeConfig;
