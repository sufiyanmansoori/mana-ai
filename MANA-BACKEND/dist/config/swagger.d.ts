import type { ParsedEnvironment } from './env-schema.js';
export interface SwaggerRuntimeConfig {
    enabled: boolean;
    path: string;
}
export declare function createSwaggerRuntimeConfig(env: ParsedEnvironment): SwaggerRuntimeConfig;
