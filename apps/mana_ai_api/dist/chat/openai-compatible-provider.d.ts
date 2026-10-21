import type { AppConfig } from '../config.js';
export interface ProviderMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}
export interface ProviderChunk {
    content: string;
    finished: boolean;
}
export declare class OpenAiCompatibleProvider {
    private readonly config;
    private readonly fetchImplementation;
    constructor(config: AppConfig, fetchImplementation?: typeof fetch);
    stream(model: string, messages: ProviderMessage[], signal: AbortSignal): Promise<AsyncGenerator<ProviderChunk>>;
}
