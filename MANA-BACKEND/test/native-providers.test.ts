import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { AppConfig } from '../src/config.js';
import { ApiError } from '../src/errors.js';
import { AnthropicProvider, GeminiProvider } from '../src/chat/native-providers.js';
import { createChatCompletionProvider } from '../src/chat/provider-factory.js';

const baseConfig: AppConfig = {
  nodeEnv: 'test',
  host: '127.0.0.1',
  port: 3000,
  corsOrigins: [],
  databaseUrl: 'postgres://localhost/test',
  databaseSsl: 'disable',
  adminSubjects: [],
  aiProvider: 'anthropic',
  aiBaseUrl: 'https://api.anthropic.com/v1',
  aiApiKey: 'test-secret',
  aiModel: 'test-model',
  aiAllowedModels: ['test-model'],
  aiTimeoutMs: 1000,
  chatRateLimitPerMinute: 10,
  chatMaxInputMessages: 10,
  chatMaxMessageCharacters: 500,
  chatMaxResponseBytes: 1024,
  logLevel: 'silent',
};

const messages = [
  { role: 'system' as const, content: 'Be concise.' },
  { role: 'user' as const, content: 'Hello' },
  { role: 'assistant' as const, content: 'Hi' },
  { role: 'user' as const, content: 'Continue' },
];

function mockStream(payload: string): Response {
  return new Response(payload, { headers: { 'content-type': 'text/event-stream' } });
}

async function collect(
  stream: AsyncGenerator<{ content: string; finished: boolean }>,
): Promise<Array<{ content: string; finished: boolean }>> {
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  return chunks;
}

test('Anthropic adapter maps system instructions, messages, and content events', async () => {
  let requestUrl = '';
  let requestHeaders: Headers | undefined;
  let requestBody: Record<string, unknown> | undefined;
  const fetchMock: typeof fetch = async (input, init) => {
    requestUrl = String(input);
    requestHeaders = new Headers(init?.headers);
    requestBody = JSON.parse(String(init?.body)) as Record<string, unknown>;
    return mockStream([
      'event: content_block_delta',
      'data: {"type":"content_block_delta","delta":{"type":"text_delta","text":"Hello"}}',
      '',
      'event: message_stop',
      'data: {"type":"message_stop"}',
      '',
    ].join('\n'));
  };
  const provider = new AnthropicProvider(baseConfig, fetchMock);
  const chunks = await provider.stream('claude-test', messages, new AbortController().signal);

  assert.deepEqual(await collect(chunks), [
    { content: 'Hello', finished: false },
    { content: '', finished: true },
  ]);
  assert.equal(requestUrl, 'https://api.anthropic.com/v1/messages');
  assert.equal(requestHeaders?.get('x-api-key'), 'test-secret');
  assert.equal(requestHeaders?.get('anthropic-version'), '2023-06-01');
  assert.equal(requestBody?.system, 'Be concise.');
  assert.deepEqual(requestBody?.messages, [
    { role: 'user', content: 'Hello' },
    { role: 'assistant', content: 'Hi' },
    { role: 'user', content: 'Continue' },
  ]);
});

test('Gemini adapter uses native roles and normalizes text and finish reason', async () => {
  let requestUrl = '';
  let requestHeaders: Headers | undefined;
  let requestBody: Record<string, unknown> | undefined;
  const fetchMock: typeof fetch = async (input, init) => {
    requestUrl = String(input);
    requestHeaders = new Headers(init?.headers);
    requestBody = JSON.parse(String(init?.body)) as Record<string, unknown>;
    return mockStream([
      'data: {"candidates":[{"content":{"parts":[{"text":"Hello"}]}}]}',
      '',
      'data: {"candidates":[{"content":{"parts":[{"text":"!"}]},"finishReason":"STOP"}]}',
      '',
    ].join('\n'));
  };
  const config: AppConfig = {
    ...baseConfig,
    aiProvider: 'gemini',
    aiBaseUrl: 'https://generativelanguage.googleapis.com/v1beta',
  };
  const provider = new GeminiProvider(config, fetchMock);
  const chunks = await provider.stream('gemini-test', messages, new AbortController().signal);

  assert.deepEqual(await collect(chunks), [
    { content: 'Hello', finished: false },
    { content: '!', finished: true },
  ]);
  assert.equal(
    requestUrl,
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-test:streamGenerateContent?alt=sse',
  );
  assert.equal(requestHeaders?.get('x-goog-api-key'), 'test-secret');
  assert.deepEqual(requestBody?.systemInstruction, { parts: [{ text: 'Be concise.' }] });
  assert.deepEqual(requestBody?.contents, [
    { role: 'user', parts: [{ text: 'Hello' }] },
    { role: 'model', parts: [{ text: 'Hi' }] },
    { role: 'user', parts: [{ text: 'Continue' }] },
  ]);
});

test('native providers reject streams that end without a final event', async () => {
  const fetchMock: typeof fetch = async () => mockStream(
    'event: content_block_delta\ndata: {"delta":{"text":"partial"}}\n\n',
  );
  const provider = new AnthropicProvider(baseConfig, fetchMock);
  const chunks = await provider.stream('claude-test', messages, new AbortController().signal);
  await assert.rejects(
    collect(chunks),
    (error: unknown) => error instanceof ApiError && error.code === 'incomplete_ai_stream',
  );
});

test('provider factory selects the configured provider', () => {
  const provider = createChatCompletionProvider(baseConfig);
  assert.ok(provider instanceof AnthropicProvider);
});
