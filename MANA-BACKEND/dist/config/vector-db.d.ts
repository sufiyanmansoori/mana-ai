import type { ParsedEnvironment } from './env-schema.js';
export interface VectorDbRuntimeConfig {
    enabled: boolean;
    provider: 'pgvector';
    dimensions: number;
    table: string;
}
export declare function createVectorDbRuntimeConfig(env: ParsedEnvironment): VectorDbRuntimeConfig;
