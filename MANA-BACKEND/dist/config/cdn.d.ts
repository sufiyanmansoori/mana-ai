import type { ParsedEnvironment } from './env-schema.js';
export interface CdnRuntimeConfig {
    enabled: boolean;
    baseUrl?: string;
    cacheControl: string;
}
export declare function createCdnRuntimeConfig(env: ParsedEnvironment): CdnRuntimeConfig;
