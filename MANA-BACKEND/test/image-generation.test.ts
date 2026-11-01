import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import express from 'express';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import type { AppConfig } from '../src/config.js';
import { loadConfig } from '../src/config.js';
import type { ChatRepository } from '../src/chat/repository.js';
import { createImageGenerationRouter } from '../src/images/routes.js';
import { OpenAiImageGenerationProvider } from '../src/images/openai-image-provider.js';
import type { AppLogger } from '../src/logger.js';
import { createErrorHandler } from '../src/middleware/errors.js';

const imageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/pWQAAAAASUVORK5CYII=';
const config = loadConfig({
  NODE_ENV: 'test',
  DATABASE_URL: 'postgres://localhost/test',
  LOCAL_JWT_SECRET: 'a-local-secret-with-more-than-thirty-two-characters',
  IMAGE_API_KEY: 'server-only-image-key',
} as NodeJS.ProcessEnv);

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
let quotaCalls = 0;

before(async () => {
  const repository = {
    async consumeChatQuota() {
      quotaCalls++;
    },
  } as unknown as Pick<ChatRepository, 'consumeChatQuota'>;
  const provider = new OpenAiImageGenerationProvider(
    config,
    async (input, init) => {
      assert.equal(String(input), 'https://api.openai.com/v1/images/generations');
      assert.equal(new Headers(init?.headers).get('authorization'), 'Bearer server-only-image-key');
      const body = JSON.parse(String(init?.body)) as Record<string, unknown>;
      assert.equal(body.model, 'gpt-image-1');
      assert.equal(body.size, '1024x1024');
      return new Response(
        JSON.stringify({
          data: [{ b64_json: imageBase64, revised_prompt: 'A generated image.' }],
        }),
        { status: 200, headers: { 'content-type': 'application/json' } },
      );
    },
  );
  const app = express();
  app.use(express.json());
  app.use('/v1', createImageGenerationRouter({
    config,
    verifier: async (token) => {
      if (token !== 'valid-token') throw new Error('Invalid token.');
      return { subject: 'image-user' };
    },
    repository,
    provider,
  }));
  app.use(createErrorHandler(logger));
  server = app.listen(0, '127.0.0.1');
  await new Promise<void>((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });
  const address = server.address() as AddressInfo;
  baseUrl = `http://127.0.0.1:${address.port}/v1/images/generations`;
});

after(async () => {
  if (!server) return;
  await new Promise<void>((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  });
});

test('image generation requires an authenticated request', async () => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ prompt: 'A lake at sunrise.' }),
  });
  assert.equal(response.status, 401);
});

test('authenticated image generation returns base64 and consumes quota', async () => {
  quotaCalls = 0;
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      authorization: 'Bearer valid-token',
      'content-type': 'application/json',
    },
    body: JSON.stringify({ prompt: 'A lake at sunrise.' }),
  });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal(quotaCalls, 1);
  assert.deepEqual(await response.json(), {
    data: {
      base64: imageBase64,
      mimeType: 'image/png',
      revisedPrompt: 'A generated image.',
    },
  });
});

test('image requests reject invalid sizes and oversized prompts', async () => {
  for (const body of [
    { prompt: 'A lake at sunrise.', size: '100x100' },
    { prompt: 'x'.repeat(4001) },
  ]) {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        authorization: 'Bearer valid-token',
        'content-type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    assert.equal(response.status, 400);
  }
});

test('image provider reports missing credentials without contacting provider', async () => {
  const { imageApiKey: _imageApiKey, ...missingKeyConfig } = config;
  let fetchCalled = false;
  const provider = new OpenAiImageGenerationProvider(
    missingKeyConfig as AppConfig,
    async () => {
      fetchCalled = true;
      return new Response();
    },
  );

  await assert.rejects(
    provider.generate({ prompt: 'A lake at sunrise.', size: '1024x1024' }),
    /IMAGE_API_KEY/,
  );
  assert.equal(fetchCalled, false);
});

test('disabled image-generation feature rejects authenticated requests before quota or provider use', async () => {
  const disabledConfig = loadConfig({
    NODE_ENV: 'test',
    DATABASE_URL: 'postgres://localhost/test',
    LOCAL_JWT_SECRET: 'a-local-secret-with-more-than-thirty-two-characters',
    IMAGE_API_KEY: 'server-only-image-key',
    FEATURE_IMAGE_GENERATION: 'false',
  } as NodeJS.ProcessEnv);
  let providerCalled = false;
  let quotaCalled = false;
  const app = express();
  app.use(express.json());
  app.use('/v1', createImageGenerationRouter({
    config: disabledConfig,
    verifier: async () => ({ subject: 'image-user' }),
    repository: {
      async consumeChatQuota() {
        quotaCalled = true;
      },
    } as unknown as Pick<ChatRepository, 'consumeChatQuota'>,
    provider: {
      async generate() {
        providerCalled = true;
        return { base64: imageBase64, mimeType: 'image/png' };
      },
    },
  }));
  app.use(createErrorHandler(logger));
  const featureServer = app.listen(0, '127.0.0.1');
  try {
    await new Promise<void>((resolve, reject) => {
      featureServer.once('listening', resolve);
      featureServer.once('error', reject);
    });
    const address = featureServer.address() as AddressInfo;
    const response = await fetch(`http://127.0.0.1:${address.port}/v1/images/generations`, {
      method: 'POST',
      headers: {
        authorization: 'Bearer valid-token',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ prompt: 'A lake at sunrise.' }),
    });
    assert.equal(response.status, 404);
    assert.equal(quotaCalled, false);
    assert.equal(providerCalled, false);
  } finally {
    await new Promise<void>((resolve, reject) => {
      featureServer.close((error) => error ? reject(error) : resolve());
    });
  }
});
