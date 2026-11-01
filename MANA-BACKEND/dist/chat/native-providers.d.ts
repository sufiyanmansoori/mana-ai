import { BaseAiProvider, type ProviderChunk, type ProviderMessage } from '../ai/providers/base-provider.provider.js';
import type { ChatCompletionProvider } from './provider.js';
declare abstract class NativeProvider extends BaseAiProvider implements ChatCompletionProvider {
}
export declare class AnthropicProvider extends NativeProvider {
    stream(model: string, messages: ProviderMessage[], signal: AbortSignal): Promise<AsyncGenerator<ProviderChunk>>;
}
export declare class GeminiProvider extends NativeProvider {
    stream(model: string, messages: ProviderMessage[], signal: AbortSignal): Promise<AsyncGenerator<ProviderChunk>>;
}
export {};
