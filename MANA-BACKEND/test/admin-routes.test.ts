import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import express from 'express';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import type { AppConfig } from '../src/config.js';
import { loadConfig } from '../src/config.js';
import { createAdminRouter } from '../src/admin/routes.js';
import type {
  AdminFeatureFlag,
  AdminFeatureFlagAuditEntry,
  AdminFeatureFlagRepositoryPort,
} from '../src/admin/feature-flag-repository.js';
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

class InMemoryFeatureFlags implements AdminFeatureFlagRepositoryPort {
  readonly flags = new Map<string, AdminFeatureFlag>();
  readonly audit: AdminFeatureFlagAuditEntry[] = [];

  async list(): Promise<AdminFeatureFlag[]> {
    return [...this.flags.values()];
  }

  async listAudit(limit: number): Promise<AdminFeatureFlagAuditEntry[]> {
    return this.audit.slice(0, limit);
  }

  async create(input: {
    key: string;
    description: string;
    enabled: boolean;
    actorSubject: string;
  }): Promise<AdminFeatureFlag> {
    const now = new Date();
    const flag: AdminFeatureFlag = {
      key: input.key,
      description: input.description,
      enabled: input.enabled,
      created_at: now,
      updated_at: now,
      updated_by: input.actorSubject,
    };
    this.flags.set(flag.key, flag);
    this.record(flag.key, 'created', input.actorSubject);
    return flag;
  }

  async setEnabled(input: {
    key: string;
    enabled: boolean;
    actorSubject: string;
  }): Promise<AdminFeatureFlag> {
    const current = this.flags.get(input.key);
    if (!current) throw new Error('Missing flag.');
    const updated = {
      ...current,
      enabled: input.enabled,
      updated_at: new Date(),
      updated_by: input.actorSubject,
    };
    this.flags.set(input.key, updated);
    this.record(input.key, 'updated', input.actorSubject);
    return updated;
  }

  async delete(input: { key: string; actorSubject: string }): Promise<void> {
    this.flags.delete(input.key);
    this.record(input.key, 'deleted', input.actorSubject);
  }

  private record(
    key: string,
    action: AdminFeatureFlagAuditEntry['action'],
    actorSubject: string,
  ): void {
    this.audit.unshift({
      id: `${this.audit.length + 1}`,
      key,
      action,
      actor_subject: actorSubject,
      previous_value: null,
      new_value: null,
      occurred_at: new Date(),
    });
  }
}

const repository = new InMemoryFeatureFlags();
let server: Server;
let baseUrl: string;

before(async () => {
  const app = express();
  app.use(express.json());
  app.use('/v1/admin', createAdminRouter({
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
  baseUrl = `http://127.0.0.1:${address.port}/v1/admin`;
});

after(async () => {
  if (!server) return;
  await new Promise<void>((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  });
});

test('admin endpoints reject unauthenticated and non-administrator requests', async () => {
  const unauthenticated = await fetch(`${baseUrl}/feature-flags`);
  assert.equal(unauthenticated.status, 401);

  const regularUser = await fetch(`${baseUrl}/feature-flags`, {
    headers: { authorization: 'Bearer user-token' },
  });
  assert.equal(regularUser.status, 403);
});

test('admins can create, update, list, audit, and delete flags', async () => {
  const headers = {
    authorization: 'Bearer admin-token',
    'content-type': 'application/json',
  };
  const created = await fetch(`${baseUrl}/feature-flags`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      key: 'new_chat_ui',
      description: 'Enable the redesigned chat experience.',
      enabled: false,
    }),
  });
  assert.equal(created.status, 201);
  assert.equal((await created.json() as { data: AdminFeatureFlag }).data.enabled, false);

  const updated = await fetch(`${baseUrl}/feature-flags/new_chat_ui`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ enabled: true }),
  });
  assert.equal(updated.status, 200);
  assert.equal((await updated.json() as { data: AdminFeatureFlag }).data.enabled, true);

  const listed = await fetch(`${baseUrl}/feature-flags`, {
    headers: { authorization: 'Bearer admin-token' },
  });
  assert.equal((await listed.json() as { data: AdminFeatureFlag[] }).data.length, 1);

  const audit = await fetch(`${baseUrl}/feature-flags/audit?limit=2`, {
    headers: { authorization: 'Bearer admin-token' },
  });
  assert.deepEqual(
    (await audit.json() as { data: AdminFeatureFlagAuditEntry[] }).data
      .map((entry) => entry.action),
    ['updated', 'created'],
  );

  const deleted = await fetch(`${baseUrl}/feature-flags/new_chat_ui`, {
    method: 'DELETE',
    headers: { authorization: 'Bearer admin-token' },
  });
  assert.equal(deleted.status, 204);
  assert.equal(repository.flags.has('new_chat_ui'), false);
});

test('feature flag endpoints reject invalid request data', async () => {
  const response = await fetch(`${baseUrl}/feature-flags`, {
    method: 'POST',
    headers: {
      authorization: 'Bearer admin-token',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      key: 'Invalid Key',
      description: '',
      enabled: true,
    }),
  });
  assert.equal(response.status, 400);
});
