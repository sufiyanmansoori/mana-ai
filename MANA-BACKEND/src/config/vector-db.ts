import type { ParsedEnvironment } from './env-schema.js';

export interface VectorDbRuntimeConfig {
  enabled: boolean;
  provider: 'pgvector';
  dimensions: number;
  table: string;
}

export function createVectorDbRuntimeConfig(env: ParsedEnvironment): VectorDbRuntimeConfig {
  return {
    enabled: env.VECTOR_DB_ENABLED,
    provider: 'pgvector',
    dimensions: env.VECTOR_DB_DIMENSIONS,
    table: env.VECTOR_DB_TABLE,
  };
}
