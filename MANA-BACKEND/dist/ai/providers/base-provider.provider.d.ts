import type { AppConfig } from '../../config.js';
export interface ProviderMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}
export interface ProviderChunk {
    content: string;
    finished: boolean;
}
export interface AiCompletionProvider {
    stream(model: string, messages: ProviderMessage[], signal: AbortSignal): Promise<AsyncGenerator<ProviderChunk>>;
}
export declare abstract class BaseAiProvider implements AiCompletionProvider {
    protected readonly config: AppConfig;
    private readonly fetchImplementation;
    constructor(config: AppConfig, fetchImplementation?: typeof fetch);
    abstract stream(model: string, messages: ProviderMessage[], signal: AbortSignal): Promise<AsyncGenerator<ProviderChunk>>;
    protected post(endpoint: URL, headers: Record<string, string>, body: unknown, signal: AbortSignal): Promise<ReadableStream<Uint8Array>>;
}
