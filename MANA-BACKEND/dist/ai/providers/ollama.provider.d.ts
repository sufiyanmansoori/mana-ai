import type { AppConfig } from '../../config.js';
import { type AiCompletionProvider, type ProviderChunk, type ProviderMessage } from './base-provider.provider.js';
export declare class OllamaProvider implements AiCompletionProvider {
    private readonly config;
    private readonly fetchImplementation;
    constructor(config: AppConfig, fetchImplementation?: typeof fetch);
    stream(model: string, messages: ProviderMessage[], signal: AbortSignal): Promise<AsyncGenerator<ProviderChunk>>;
}
