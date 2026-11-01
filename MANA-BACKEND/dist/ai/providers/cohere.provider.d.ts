import { BaseAiProvider, type ProviderChunk, type ProviderMessage } from './base-provider.provider.js';
export declare class CohereProvider extends BaseAiProvider {
    stream(model: string, messages: ProviderMessage[], signal: AbortSignal): Promise<AsyncGenerator<ProviderChunk>>;
}
