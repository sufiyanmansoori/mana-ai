import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { AppConfig } from '../src/config.js';
import { ApiError } from '../src/errors.js';
import { ProviderRegistry, createProviderRegistry } from '../src/ai/providers/provider-registry.provider.js';
import type { AiCompletionProvider } from '../src/ai/providers/base-provider.provider.js';
import { AnthropicProvider, GeminiProvider } from '../src/chat/native-providers.js';
import { OpenAiCompatibleProvider } from '../src/chat/openai-compatible-provider.js';
import { AzureOpenAiProvider } from '../src/ai/providers/azure-openai.provider.js';
import { CohereProvider } from '../src/ai/providers/cohere.provider.js';
import { GroqProvider } from '../src/ai/providers/groq.provider.js';
import { MistralProvider } from '../src/ai/providers/mistral.provider.js';
import { OllamaProvider } from '../src/ai/providers/ollama.provider.js';
import { OpenAiProvider } from '../src/ai/providers/openai.provider.js';

const config: AppConfig = {
  nodeEnv: 'test',
  host: '127.0.0.1',
  port: 3000,
  corsOrigins: [],
  databaseUrl: 'postgres://localhost/test',
  databaseSsl: 'disable',
  adminSubjects: [],
  aiProvider: 'openai-compatible',
  aiBaseUrl: 'https://api.openai.com/v1',
  aiApiKey: 'test-key',
  aiModel: 'test-model',
  aiAllowedModels: ['test-model'],
  aiTimeoutMs: 1000,
  chatRateLimitPerMinute: 10,
  chatMaxInputMessages: 10,
  chatMaxMessageCharacters: 500,
  chatMaxResponseBytes: 1024,
  logLevel: 'silent',
};

const provider: AiCompletionProvider = {
  async stream() {
    async function* chunks() {
      yield { content: 'ok', finished: true };
    }
    return chunks();
  },
};

test('default registry exposes only providers implemented by this API', () => {
  const registry = createProviderRegistry(config);

  assert.deepEqual(registry.list(), [
    'openai',
    'openai-compatible',
    'anthropic',
    'azure-openai',
    'cohere',
    'gemini',
    'groq',
    'mistral',
    'ollama',
  ]);
  assert.ok(registry.get('openai') instanceof OpenAiProvider);
  assert.ok(registry.get('openai-compatible') instanceof OpenAiCompatibleProvider);
  assert.ok(registry.get('anthropic') instanceof AnthropicProvider);
  assert.ok(registry.get('azure-openai') instanceof AzureOpenAiProvider);
  assert.ok(registry.get('cohere') instanceof CohereProvider);
  assert.ok(registry.get('gemini') instanceof GeminiProvider);
  assert.ok(registry.get('groq') instanceof GroqProvider);
  assert.ok(registry.get('mistral') instanceof MistralProvider);
  assert.ok(registry.get('ollama') instanceof OllamaProvider);
});

test('registry rejects missing provider registrations explicitly', () => {
  const registry = new ProviderRegistry([['openai-compatible', provider]]);

  assert.throws(
    () => registry.get('anthropic'),
    (error: unknown) => error instanceof ApiError &&
      error.status === 500 &&
      error.code === 'unsupported_ai_provider',
  );
});

test('registry prevents duplicate provider registrations', () => {
  assert.throws(
    () => new ProviderRegistry([
      ['openai-compatible', provider],
      ['openai-compatible', provider],
    ]),
    /registered more than once/,
  );
});
