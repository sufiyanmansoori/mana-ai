import type { ParsedEnvironment } from './env-schema.js';
export interface AiRuntimeConfig {
    provider: ParsedEnvironment['AI_PROVIDER'];
    baseUrl: string;
    apiKey?: string;
    apiVersion?: string;
    model: string;
    allowedModels: string[];
    timeoutMs: number;
    maxRetries: number;
    circuitBreakerFailures: number;
    circuitBreakerResetMs: number;
    imageApiKey?: string;
    imageBaseUrl: string;
    imageModel: string;
    imageTimeoutMs: number;
}
export declare function createAiRuntimeConfig(env: ParsedEnvironment): AiRuntimeConfig;
