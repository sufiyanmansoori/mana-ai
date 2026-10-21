import type { AppConfig } from '../config.js';
import { OpenAiCompatibleProvider, type ProviderChunk } from './openai-compatible-provider.js';
import { ChatRepository } from './repository.js';
import type { ChatRequest } from './schemas.js';
export interface PreparedCompletion {
    conversationId: string;
    model: string;
    chunks: AsyncGenerator<ProviderChunk>;
    persist: (assistantContent: string) => Promise<void>;
}
export declare class ChatService {
    private readonly config;
    private readonly repository;
    private readonly provider;
    constructor(config: AppConfig, repository: ChatRepository, provider: OpenAiCompatibleProvider);
    prepare(subject: string, input: ChatRequest, signal: AbortSignal): Promise<PreparedCompletion>;
}
