import { ApiError } from '../../errors.js';
import { AnthropicProvider, GeminiProvider } from '../../chat/native-providers.js';
import { OpenAiCompatibleProvider } from '../../chat/openai-compatible-provider.js';
import { AzureOpenAiProvider } from './azure-openai.provider.js';
import { CohereProvider } from './cohere.provider.js';
import { GroqProvider } from './groq.provider.js';
import { MistralProvider } from './mistral.provider.js';
import { OllamaProvider } from './ollama.provider.js';
import { OpenAiProvider } from './openai.provider.js';
export class ProviderRegistry {
    providers;
    constructor(entries) {
        const providers = new Map();
        for (const [id, provider] of entries) {
            if (providers.has(id)) {
                throw new Error(`AI provider "${id}" is registered more than once.`);
            }
            providers.set(id, provider);
        }
        this.providers = providers;
    }
    get(id) {
        const provider = this.providers.get(id);
        if (!provider) {
            throw new ApiError(500, 'unsupported_ai_provider', 'The configured AI provider is not supported.');
        }
        return provider;
    }
    list() {
        return [...this.providers.keys()];
    }
}
export function createProviderRegistry(config) {
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
//# sourceMappingURL=provider-registry.provider.js.map