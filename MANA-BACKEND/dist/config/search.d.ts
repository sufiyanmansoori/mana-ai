import type { ParsedEnvironment } from './env-schema.js';
export interface SearchRuntimeConfig {
    enabled: boolean;
    minimumQueryLength: number;
    maximumResults: number;
    timeoutMs: number;
}
export declare function createSearchRuntimeConfig(env: ParsedEnvironment): SearchRuntimeConfig;
