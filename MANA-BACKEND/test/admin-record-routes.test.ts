import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import express from 'express';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import type { AppConfig } from '../src/config.js';
import { loadConfig } from '../src/config.js';
import type {
  AdminRecord,
  AdminRecordPage,
  AdminRecordRepositoryPort,
} from '../src/admin/record-repository.js';
import { createAdminRecordRouter } from '../src/admin/record-routes.js';
import type { AppLogger } from '../src/logger.js';
import { createErrorHandler } from '../src/middleware/errors.js';

const config: AppConfig = {
  ...loadConfig({
    NODE_ENV: 'test',
    DATABASE_URL: 'postgres://localhost/test',
    LOCAL_JWT_SECRET: 'a-local-secret-with-more-than-thirty-two-characters',
    ADMIN_SUBJECTS: 'admin-user',
  } as NodeJS.ProcessEnv),
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

class InMemoryAdminRecords implements AdminRecordRepositoryPort {
  readonly records = new Map<string, AdminRecord>();
  lastListInput: { limit: number; cursor?: string } | undefined;

  async list(input: { limit: number; cursor?: string }): Promise<AdminRecordPage> {
    this.lastListInput = input;
    return { records: [...this.records.values()].slice(0, input.limit), nextCursor: null };
  }

  async getById(id: string): Promise<AdminRecord | null> {
    return this.records.get(id) ?? null;
  }

  async save(record: AdminRecord): Promise<AdminRecord> {
    this.records.set(record.id, record);
    return record;
  }

  async delete(id: string): Promise<void> {
    this.records.delete(id);
  }
}

const repository = new InMemoryAdminRecords();
let server: Server;
let baseUrl: string;

before(async () => {
  const app = express();
  app.use(express.json());
  app.use('/v1/admin', createAdminRecordRouter({
    config,
    verifier: async (token) => {
      if (token === 'admin-token') return { subject: 'admin-user' };
      if (token === 'user-token') return { subject: 'regular-user' };
      throw new Error('Invalid token.');
    },
    repository,
  }));
  app.use(createErrorHandler(logger));
  server = app.listen(0, '127.0.0.1');
  await new Promise<void>((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });
  const address = server.address() as AddressInfo;
  baseUrl = `http://127.0.0.1:${address.port}/v1/admin/records`;
});

after(async () => {
  if (!server) return;
  await new Promise<void>((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  });
});

test('admin record endpoints require an authorized administrator', async () => {
  const unauthenticated = await fetch(baseUrl);
  assert.equal(unauthenticated.status, 401);

  const regularUser = await fetch(baseUrl, {
    headers: { authorization: 'Bearer user-token' },
  });
  assert.equal(regularUser.status, 403);
});

test('admins can page, read, save, and delete records', async () => {
  const headers = {
    authorization: 'Bearer admin-token',
    'content-type': 'application/json',
  };
  const saved = await fetch(`${baseUrl}/record-1`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ createdAt: '2026-10-25T00:00:00.000Z' }),
  });
  assert.equal(saved.status, 200);
  assert.deepEqual(
    (await saved.json() as { data: AdminRecord }).data,
    { id: 'record-1', createdAt: '2026-10-25T00:00:00.000Z' },
  );

  const listed = await fetch(`${baseUrl}?limit=7&cursor=next-page`, {
    headers,
  });
  assert.equal(listed.status, 200);
  assert.deepEqual(repository.lastListInput, { limit: 7, cursor: 'next-page' });
  assert.deepEqual((await listed.json() as { data: AdminRecord[] }).data.map((r) => r.id), [
    'record-1',
  ]);

  const found = await fetch(`${baseUrl}/record-1`, { headers });
  assert.equal(found.status, 200);

  const deleted = await fetch(`${baseUrl}/record-1`, {
    method: 'DELETE',
    headers,
  });
  assert.equal(deleted.status, 204);
  assert.equal(repository.records.has('record-1'), false);
});

test('record endpoints reject invalid pagination, IDs, and payloads', async () => {
  const headers = {
    authorization: 'Bearer admin-token',
    'content-type': 'application/json',
  };

  assert.equal((await fetch(`${baseUrl}?limit=101`, { headers })).status, 400);
  assert.equal((await fetch(`${baseUrl}/%20`, { headers })).status, 400);

  const invalidBody = await fetch(`${baseUrl}/record-2`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      createdAt: 'not-a-date',
      unexpected: true,
    }),
  });
  assert.equal(invalidBody.status, 400);
});

test('record reads return 404 when a record does not exist', async () => {
  const response = await fetch(`${baseUrl}/missing`, {
    headers: { authorization: 'Bearer admin-token' },
  });
  assert.equal(response.status, 404);
});
