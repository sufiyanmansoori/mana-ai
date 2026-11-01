import type { ParsedEnvironment } from './env-schema.js';
export interface FeatureConfig {
    imageGeneration: boolean;
    voice: boolean;
    webSearch: boolean;
    documentRag: boolean;
}
export declare function createFeatureConfig(env: ParsedEnvironment): FeatureConfig;
