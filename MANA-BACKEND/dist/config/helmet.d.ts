import type { ParsedEnvironment } from './env-schema.js';
export interface HelmetRuntimeConfig {
    contentSecurityPolicy: boolean;
    hstsMaxAgeSeconds: number;
}
export declare function createHelmetRuntimeConfig(env: ParsedEnvironment): HelmetRuntimeConfig;
