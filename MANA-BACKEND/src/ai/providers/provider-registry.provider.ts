import type { AppConfig } from '../../config.js';
import { ApiError } from '../../errors.js';
import { AnthropicProvider, GeminiProvider } from '../../chat/native-providers.js';
import { OpenAiCompatibleProvider } from '../../chat/openai-compatible-provider.js';
import { AzureOpenAiProvider } from './azure-openai.provider.js';
import { CohereProvider } from './cohere.provider.js';
import { GroqProvider } from './groq.provider.js';
import { MistralProvider } from './mistral.provider.js';
import { OllamaProvider } from './ollama.provider.js';
import { OpenAiProvider } from './openai.provider.js';
import type { AiCompletionProvider } from './base-provider.provider.js';

export type AiProviderId = AppConfig['aiProvider'];

export class ProviderRegistry {
  private readonly providers: ReadonlyMap<AiProviderId, AiCompletionProvider>;

  constructor(entries: readonly (readonly [AiProviderId, AiCompletionProvider])[]) {
    const providers = new Map<AiProviderId, AiCompletionProvider>();
    for (const [id, provider] of entries) {
      if (providers.has(id)) {
        throw new Error(`AI provider "${id}" is registered more than once.`);
      }
      providers.set(id, provider);
    }
    this.providers = providers;
  }

  get(id: AiProviderId): AiCompletionProvider {
    const provider = this.providers.get(id);
    if (!provider) {
      throw new ApiError(
        500,
        'unsupported_ai_provider',
        'The configured AI provider is not supported.',
      );
    }
    return provider;
  }

  list(): AiProviderId[] {
    return [...this.providers.keys()];
  }
}

export function createProviderRegistry(config: AppConfig): ProviderRegistry {
  return new ProviderRegistry([
    ['openai', new OpenAiProvider(config)],
    ['openai-compatible', new OpenAiCompatibleProvider(config)],
    ['anthropic', new AnthropicProvider(config)],
    ['azure-openai', new AzureOpenAiProvider(config, {
      apiVersion: config.aiApiVersion ?? '2024-10-21',
    })],
    ['cohere', new CohereProvider(config)],
    ['gemini', new GeminiProvider(config)],
    ['groq', new GroqProvider(config)],
    ['mistral', new MistralProvider(config)],
    ['ollama', new OllamaProvider(config)],
  ]);
}