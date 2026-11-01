import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { Pool } from 'pg';
import { ApiError } from '../src/errors.js';
import { ChatRepository } from '../src/chat/repository.js';

test('conversation access queries are constrained to the requesting owner', async () => {
  let queryText = '';
  let queryValues: unknown[] = [];
  const pool = {
    query: async (text: string, values: unknown[]) => {
      queryText = text;
      queryValues = values;
      return { rows: [], rowCount: 0 };
    },
  } as unknown as Pool;
  const repository = new ChatRepository(pool);

  await assert.rejects(
    repository.ensureConversationAccess('another-user', '123e4567-e89b-42d3-a456-426614174000'),
    (error: unknown) => error instanceof ApiError && error.status === 404,
  );
  assert.match(queryText, /owner_subject = \$2/);
  assert.deepEqual(queryValues, ['123e4567-e89b-42d3-a456-426614174000', 'another-user']);
});

test('chat rate limit returns 429 when the shared quota is exhausted', async () => {
  const pool = {
    query: async () => ({ rows: [], rowCount: 0 }),
  } as unknown as Pool;
  const repository = new ChatRepository(pool);
  await assert.rejects(
    repository.consumeChatQuota('user-123', 10),
    (error: unknown) => error instanceof ApiError && error.status === 429,
  );
});

test('conversation filters use parameters and escape search wildcards', async () => {
  let queryText = '';
  let queryValues: unknown[] = [];
  const pool = {
    query: async (text: string, values: unknown[]) => {
      queryText = text;
      queryValues = values;
      return { rows: [], rowCount: 0 };
    },
  } as unknown as Pool;
  const repository = new ChatRepository(pool);
  await repository.listConversations('user-123', 2, 10, {
    query: '100%_safe',
    folderId: '123e4567-e89b-42d3-a456-426614174000',
    pinned: false,
  });

  assert.match(queryText, /folder_id = \$2/);
  assert.match(queryText, /pinned_at IS NULL/);
  assert.ok(queryText.includes("m.content ILIKE $3 ESCAPE '\\'"));
  assert.doesNotMatch(queryText, /100%_safe/);
  assert.deepEqual(queryValues, [
    'user-123',
    '123e4567-e89b-42d3-a456-426614174000',
    '%100\\%\\_safe%',
    10,
    10,
  ]);
});

test('folder assignment is restricted to the conversation and folder owner', async () => {
  let queryText = '';
  let queryValues: unknown[] = [];
  const pool = {
    query: async (text: string, values: unknown[]) => {
      queryText = text;
      queryValues = values;
      return { rows: [], rowCount: 0 };
    },
  } as unknown as Pool;
  const repository = new ChatRepository(pool);

  await assert.rejects(
    repository.setFolder(
      'user-123',
      '123e4567-e89b-42d3-a456-426614174000',
      '123e4567-e89b-42d3-a456-426614174001',
    ),
    (error: unknown) => error instanceof ApiError && error.status === 404,
  );
  assert.match(queryText, /owner_subject = \$2/);
  assert.match(queryText, /f\.owner_subject = \$2/);
  assert.deepEqual(queryValues, [
    '123e4567-e89b-42d3-a456-426614174000',
    'user-123',
    '123e4567-e89b-42d3-a456-426614174001',
  ]);
});
