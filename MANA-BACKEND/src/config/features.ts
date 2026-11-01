import type { ParsedEnvironment } from './env-schema.js';

export interface FeatureConfig {
  imageGeneration: boolean;
  voice: boolean;
  webSearch: boolean;
  documentRag: boolean;
}

export function createFeatureConfig(env: ParsedEnvironment): FeatureConfig {
  return {
    imageGeneration: env.FEATURE_IMAGE_GENERATION,
    voice: env.FEATURE_VOICE,
    webSearch: env.FEATURE_WEB_SEARCH,
    documentRag: env.FEATURE_DOCUMENT_RAG,
  };
}
