import type { AppConfig } from '../config.js';
import { BaseAiProvider, type ProviderChunk, type ProviderMessage } from '../ai/providers/base-provider.provider.js';
export type { ProviderChunk, ProviderMessage } from '../ai/providers/base-provider.provider.js';
export declare class OpenAiCompatibleProvider extends BaseAiProvider {
    constructor(config: AppConfig, fetchImplementation?: typeof fetch);
    stream(model: string, messages: ProviderMessage[], signal: AbortSignal): Promise<AsyncGenerator<ProviderChunk>>;
}
export declare function parseOpenAiCompatibleStream(body: ReadableStream<Uint8Array>, maximumBytes: number): AsyncGenerator<ProviderChunk>;
