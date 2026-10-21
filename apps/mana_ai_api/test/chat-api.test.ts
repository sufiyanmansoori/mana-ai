import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import type { AppConfig } from '../src/config.js';
import { createApp } from '../src/app.js';
import type { AppLogger } from '../src/logger.js';
import type { ChatService, PreparedCompletion } from '../src/chat/service.js';

const config: AppConfig = {
  nodeEnv: 'test',
  host: '127.0.0.1',
  port: 0,
  corsOrigins: ['http://localhost:8080'],
  databaseUrl: 'postgres://test:test@localhost/test',
  databaseSsl: 'disable',
  aiBaseUrl: 'https://api.openai.com/v1',
  aiModel: 'test-model',
  aiAllowedModels: ['test-model'],
  aiTimeoutMs: 1000,
  chatRateLimitPerMinute: 10,
  chatMaxInputMessages: 10,
  chatMaxMessageCharacters: 500,
  chatMaxResponseBytes: 1024,
  logLevel: 'silent',
};

const logger = {
  info() {},
  warn() {},
  error() {},
  debug() {},
  trace() {},
  fatal() {},
  silent() {},
  level: 'silent',
  isLevelEnabled: () => false,
} as unknown as AppLogger;

let server: Server;
let baseUrl: string;
let lastConversationListArguments: unknown[] = [];

before(async () => {
  const chatService = {
    async prepare(): Promise<PreparedCompletion> {
      async function* chunks() {
        yield { content: 'Hello ', finished: false };
        yield { content: 'from Mana', finished: true };
      }
      return {
        conversationId: '123e4567-e89b-42d3-a456-426614174000',
        model: 'test-model',
        chunks: chunks(),
        persist: async () => {},
      };
    },
  } as unknown as ChatService;
  const savedPreferences = new Map<string, {
    locale: string;
    theme_mode: string;
    default_model: string;
    updated_at: Date;
  }>();
  const app = createApp({
    config,
    logger,
    tokenVerifier: async (token) => {
      if (token !== 'valid-token') throw new Error('invalid token');
      return { subject: 'user-123' };
    },
    pool: {
      query: async (text: string, values: unknown[]) => {
        if (text.startsWith('SELECT locale, theme_mode, default_model')) {
          const saved = savedPreferences.get(String(values[0]));
          return { rows: saved ? [saved] : [], rowCount: saved ? 1 : 0 };
        }
        if (text.startsWith('INSERT INTO user_preferences')) {
          const subject = String(values[0]);
          const existing = savedPreferences.get(subject);
          const next = {
            locale: values[4] === true ? String(values[1]) : existing?.locale ?? String(values[1]),
            theme_mode: values[5] === true ? String(values[2]) : existing?.theme_mode ?? String(values[2]),
            default_model: values[6] === true
              ? String(values[3])
              : existing?.default_model ?? String(values[3]),
            updated_at: new Date(),
          };
          savedPreferences.set(subject, next);
          return { rows: [next], rowCount: 1 };
        }
        if (text.startsWith('DELETE FROM user_preferences')) {
          savedPreferences.delete(String(values[0]));
          return { rows: [], rowCount: 1 };
        }
        return { rows: [], rowCount: 1 };
      },
    } as never,
    chatService,
    chatRepository: {
      listConversations: async (...args: unknown[]) => {
        lastConversationListArguments = args;
        return [];
      },
      listMessages: async () => [],
      listFolders: async () => [],
      createFolder: async (_subject: string, name: string) => ({
        id: '123e4567-e89b-42d3-a456-426614174000',
        name,
        created_at: new Date('2026-01-01T00:00:00.000Z'),
        updated_at: new Date('2026-01-01T00:00:00.000Z'),
      }),
      renameFolder: async () => {},
      deleteFolder: async () => {},
      renameConversation: async () => {},
      archiveConversation: async () => {},
      setPinned: async () => {},
      setFolder: async () => {},
    } as never,
  });
  server = createServer(app);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address() as AddressInfo;
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  });
});

test('liveness is public and returns a healthy status', async () => {
  const response = await fetch(`${baseUrl}/health/live`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: 'ok' });
});

test('chat rejects requests without a bearer token', async () => {
  const response = await fetch(`${baseUrl}/v1/chat/completions`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      model: 'test-model',
      stream: true,
      messages: [{ role: 'user', content: 'Hello' }],
    }),
  });
  assert.equal(response.status, 401);
  assert.equal(response.headers.get('x-request-id')?.length, 36);
});

test('authenticated chat streams OpenAI-compatible chunks', async () => {
  const response = await fetch(`${baseUrl}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      authorization: 'Bearer valid-token',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'test-model',
      stream: true,
      messages: [{ role: 'user', content: 'Hello' }],
    }),
  });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-type')?.startsWith('text/event-stream'), true);
  assert.equal(response.headers.get('x-conversation-id'), '123e4567-e89b-42d3-a456-426614174000');
  const body = await response.text();
  assert.match(body, /"content":"Hello "/);
  assert.match(body, /"content":"from Mana"/);
  assert.match(body, /data: \[DONE\]/);
});

test('chat validates request fields before starting an AI stream', async () => {
  const response = await fetch(`${baseUrl}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      authorization: 'Bearer valid-token',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      stream: false,
      messages: [{ role: 'user', content: 'Hello' }],
    }),
  });
  assert.equal(response.status, 400);
  assert.deepEqual((await response.json() as { error: { code: string } }).error.code, 'validation_error');
});

test('conversation search, folder, and pin filters are parsed and forwarded', async () => {
  const folderId = '123e4567-e89b-42d3-a456-426614174000';
  const response = await fetch(
    `${baseUrl}/v1/conversations?q=hello&folder_id=${folderId}&pinned=true&limit=10`,
    {
    headers: { authorization: 'Bearer valid-token' },
    },
  );
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { data: [], page: 1, limit: 10 });
  assert.deepEqual(lastConversationListArguments, [
    'user-123',
    1,
    10,
    { query: 'hello', folderId, pinned: true },
  ]);
});

test('conversation folders can be created with a validated display name', async () => {
  const response = await fetch(`${baseUrl}/v1/conversation-folders`, {
    method: 'POST',
    headers: {
      authorization: 'Bearer valid-token',
      'content-type': 'application/json',
    },
    body: JSON.stringify({ name: 'Work' }),
  });
  assert.equal(response.status, 201);
  assert.equal((await response.json() as { data: { name: string } }).data.name, 'Work');
});

test('folder mutations require a bearer token', async () => {
  const response = await fetch(`${baseUrl}/v1/conversation-folders`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name: 'Private' }),
  });
  assert.equal(response.status, 401);
});

test('preferences persist per authenticated user', async () => {
  const patch = await fetch(`${baseUrl}/v1/preferences`, {
    method: 'PATCH',
    headers: {
      authorization: 'Bearer valid-token',
      'content-type': 'application/json',
    },
    body: JSON.stringify({ locale: 'hi', theme_mode: 'dark' }),
  });
  assert.equal(patch.status, 200);
  const updated = (await patch.json()) as {
    data: { locale: string; theme_mode: string; default_model: string };
  };
  assert.equal(updated.data.locale, 'hi');
  assert.equal(updated.data.theme_mode, 'dark');
  assert.equal(updated.data.default_model, 'test-model');

  const get = await fetch(`${baseUrl}/v1/preferences`, {
    headers: { authorization: 'Bearer valid-token' },
  });
  assert.equal(get.status, 200);
  const preferences = (await get.json()) as {
    data: { locale: string; theme_mode: string; default_model: string };
  };
  assert.equal(preferences.data.locale, 'hi');
  assert.equal(preferences.data.theme_mode, 'dark');
  assert.equal(preferences.data.default_model, 'test-model');
});

test('preferences reject models outside the configured allowlist', async () => {
  const response = await fetch(`${baseUrl}/v1/preferences`, {
    method: 'PATCH',
    headers: {
      authorization: 'Bearer valid-token',
      'content-type': 'application/json',
    },
    body: JSON.stringify({ default_model: 'unapproved-model' }),
  });
  assert.equal(response.status, 400);
  assert.equal(
    (await response.json() as { error: { code: string } }).error.code,
    'unsupported_model',
  );
});

test('preferences reject unsupported theme values and empty updates', async () => {
  for (const body of [{ theme_mode: 'neon' }, {}]) {
    const response = await fetch(`${baseUrl}/v1/preferences`, {
      method: 'PATCH',
      headers: {
        authorization: 'Bearer valid-token',
        'content-type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    assert.equal(response.status, 400);
  }
});
