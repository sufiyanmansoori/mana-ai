import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { AppConfig } from '../src/config.js';
import { ApiError } from '../src/errors.js';
import { AzureOpenAiProvider } from '../src/ai/providers/azure-openai.provider.js';
import { CohereProvider } from '../src/ai/providers/cohere.provider.js';
import { GroqProvider } from '../src/ai/providers/groq.provider.js';
import { MistralProvider } from '../src/ai/providers/mistral.provider.js';
import { OllamaProvider } from '../src/ai/providers/ollama.provider.js';

const config: AppConfig = {
  nodeEnv: 'test',
  host: '127.0.0.1',
  port: 3000,
  corsOrigins: [],
  databaseUrl: 'postgres://localhost/test',
  databaseSsl: 'disable',
  adminSubjects: [],
  aiProvider: 'openai-compatible',
  aiBaseUrl: 'https://provider.example/v1',
  aiApiKey: 'test-api-key',
  aiModel: 'test-model',
  aiAllowedModels: ['test-model'],
  aiTimeoutMs: 1000,
  chatRateLimitPerMinute: 10,
  chatMaxInputMessages: 10,
  chatMaxMessageCharacters: 500,
  chatMaxResponseBytes: 1024,
  logLevel: 'silent',
};

const input = [{ role: 'user' as const, content: 'Hello' }];

function sseResponse(text: string): Response {
  return new Response(text, { headers: { 'content-type': 'text/event-stream' } });
}

async function collect(
  stream: AsyncGenerator<{ content: string; finished: boolean }>,
): Promise<Array<{ content: string; finished: boolean }>> {
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  return chunks;
}

test('Groq and Mistral adapters use documented OpenAI-compatible endpoints', async () => {
  const urls: string[] = [];
  const fetchImplementation: typeof fetch = async (url) => {
    urls.push(String(url));
    return sseResponse('data: {"choices":[{"delta":{"content":"ok"},"finish_reason":"stop"}]}\n\ndata: [DONE]\n\n');
  };
  const groq = new GroqProvider(config, fetchImplementation);
  const mistral = new MistralProvider(config, fetchImplementation);
  await collect(await groq.stream('llama-model', input, new AbortController().signal));
  await collect(await mistral.stream('mistral-model', input, new AbortController().signal));
  assert.deepEqual(urls, [
    'https://api.groq.com/openai/v1/chat/completions',
    'https://api.mistral.ai/v1/chat/completions',
  ]);
});

test('Azure adapter uses the deployment path and API version header scheme', async () => {
  let requestUrl = '';
  let requestHeaders: Headers | undefined;
  const provider = new AzureOpenAiProvider(config, {
    apiVersion: '2024-10-21',
    fetchImplementation: async (url, init) => {
      requestUrl = String(url);
      requestHeaders = new Headers(init?.headers);
      return sseResponse('data: {"choices":[{"delta":{"content":"azure"},"finish_reason":"stop"}]}\n\ndata: [DONE]\n\n');
    },
  });
  const chunks = await collect(await provider.stream('deployment/name', input, new AbortController().signal));
  assert.match(requestUrl, /openai\/deployments\/deployment%2Fname\/chat\/completions\?api-version=2024-10-21/u);
  assert.equal(requestHeaders?.get('api-key'), 'test-api-key');
  assert.deepEqual(chunks, [
    { content: 'azure', finished: true },
    { content: '', finished: true },
  ]);
});

test('Azure adapter rejects malformed API versions before issuing requests', () => {
  assert.throws(() => new AzureOpenAiProvider(config, { apiVersion: 'latest' }), /date format/u);
});

test('Cohere adapter parses content and final SSE events', async () => {
  const provider = new CohereProvider(config, async () => sseResponse([
    'event: content-delta',
    'data: {"type":"content-delta","delta":{"message":{"content":{"text":"hello"}}}}',
    '',
    'event: message-end',
    'data: {"type":"message-end"}',
    '',
  ].join('\n')));
  const chunks = await collect(await provider.stream(
    'command-model',
    input,
    new AbortController().signal,
  ));
  assert.deepEqual(chunks, [
    { content: 'hello', finished: false },
    { content: '', finished: true },
  ]);
});

test('Cohere adapter rejects a truncated response', async () => {
  const provider = new CohereProvider(config, async () => sseResponse(
    'event: content-delta\ndata: {"type":"content-delta","delta":{"message":{"content":{"text":"partial"}}}}\n\n',
  ));
  const stream = await provider.stream('command-model', input, new AbortController().signal);
  await assert.rejects(collect(stream), (error: unknown) =>
    error instanceof ApiError && error.code === 'incomplete_ai_stream'
  );
});

test('Ollama adapter parses NDJSON deltas without requiring an API key', async () => {
  let requestUrl = '';
  let requestHeaders: Headers | undefined;
  const configWithoutKey = { ...config, aiApiKey: undefined };
  const provider = new OllamaProvider(configWithoutKey, async (url, init) => {
    requestUrl = String(url);
    requestHeaders = new Headers(init?.headers);
    return new Response([
      '{"message":{"content":"hello"},"done":false}',
      '{"message":{"content":"!"},"done":true}',
    ].join('\n'), { headers: { 'content-type': 'application/x-ndjson' } });
  });
  const chunks = await collect(await provider.stream('llama3', input, new AbortController().signal));
  assert.equal(requestUrl, 'https://provider.example/api/chat');
  assert.equal(requestHeaders?.has('authorization'), false);
  assert.deepEqual(chunks, [
    { content: 'hello', finished: false },
    { content: '!', finished: true },
  ]);
});

test('Ollama adapter rejects streams without a done marker', async () => {
  const provider = new OllamaProvider(config, async () => new Response(
    '{"message":{"content":"partial"},"done":false}\n',
    { headers: { 'content-type': 'application/x-ndjson' } },
  ));
  const stream = await provider.stream('llama3', input, new AbortController().signal);
  await assert.rejects(collect(stream), (error: unknown) =>
    error instanceof ApiError && error.code === 'incomplete_ai_stream'
  );
});
