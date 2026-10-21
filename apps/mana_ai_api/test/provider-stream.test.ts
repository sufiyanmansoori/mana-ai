import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { AppConfig } from '../src/config.js';
import { ApiError } from '../src/errors.js';
import { OpenAiCompatibleProvider } from '../src/chat/openai-compatible-provider.js';

const config: AppConfig = {
  nodeEnv: 'test',
  host: '127.0.0.1',
  port: 3000,
  corsOrigins: [],
  databaseUrl: 'postgres://test:test@localhost/test',
  databaseSsl: 'disable',
  aiBaseUrl: 'https://provider.example/v1',
  aiApiKey: 'test-key',
  aiModel: 'model-a',
  aiAllowedModels: ['model-a'],
  aiTimeoutMs: 1000,
  chatRateLimitPerMinute: 10,
  chatMaxInputMessages: 10,
  chatMaxMessageCharacters: 500,
  chatMaxResponseBytes: 1024,
  logLevel: 'silent',
};

test('provider adapter parses events split across network chunks', async () => {
  const payload = [
    'data: {"choices":[{"delta":{"content":"hello"},"finish_reason":null}]}',
    '',
    'data: [DONE]',
    '',
  ].join('\n');
  const bytes = new TextEncoder().encode(payload);
  const fetchMock: typeof fetch = async () => new Response(new ReadableStream({
    start(controller) {
      controller.enqueue(bytes.slice(0, 13));
      controller.enqueue(bytes.slice(13, 47));
      controller.enqueue(bytes.slice(47));
      controller.close();
    },
  }), { headers: { 'content-type': 'text/event-stream' } });
  const provider = new OpenAiCompatibleProvider(config, fetchMock);
  const chunks = await provider.stream('model-a', [{ role: 'user', content: 'hi' }], new AbortController().signal);
  const values = [];
  for await (const chunk of chunks) values.push(chunk);
  assert.deepEqual(values, [
    { content: 'hello', finished: false },
    { content: '', finished: true },
  ]);
});

test('provider adapter rejects truncated streams instead of reporting success', async () => {
  const payload = 'data: {"choices":[{"delta":{"content":"partial"},"finish_reason":null}]}\n\n';
  const fetchMock: typeof fetch = async () => new Response(payload, {
    headers: { 'content-type': 'text/event-stream' },
  });
  const provider = new OpenAiCompatibleProvider(config, fetchMock);
  const chunks = await provider.stream('model-a', [{ role: 'user', content: 'hi' }], new AbortController().signal);
  await assert.rejects(async () => {
    for await (const _chunk of chunks) {
      // The stream must end with the provider's explicit [DONE] marker.
    }
  }, (error: unknown) => error instanceof ApiError && error.code === 'incomplete_ai_stream');
});

test('provider adapter fails clearly when credentials are absent', async () => {
  const provider = new OpenAiCompatibleProvider({ ...config, aiApiKey: undefined });
  await assert.rejects(
    provider.stream('model-a', [{ role: 'user', content: 'hi' }], new AbortController().signal),
    (error: unknown) => error instanceof ApiError && error.code === 'ai_provider_not_configured',
  );
});
