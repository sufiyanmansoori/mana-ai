import type { AppConfig } from '../../config.js';
import { BaseAiProvider, type ProviderChunk, type ProviderMessage } from './base-provider.provider.js';
export interface AzureOpenAiOptions {
    apiVersion: string;
    fetchImplementation?: typeof fetch;
}
export declare class AzureOpenAiProvider extends BaseAiProvider {
    private readonly apiVersion;
    constructor(config: AppConfig, options: AzureOpenAiOptions);
    stream(deployment: string, messages: ProviderMessage[], signal: AbortSignal): Promise<AsyncGenerator<ProviderChunk>>;
}
