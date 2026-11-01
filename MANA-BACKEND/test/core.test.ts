import assert from 'node:assert/strict';
import { test } from 'node:test';
import { CacheManager } from '../src/core/cache/cache-manager.js';
import { memoizeAsync } from '../src/core/cache/memoize.js';
import { SelectQueryBuilder } from '../src/core/database/query-builder.js';
import { EventBus } from '../src/core/events/event-bus.js';
import { createPagination, paginationOffset } from '../src/core/http/pagination.js';
import { I18nService } from '../src/core/i18n/i18n-service.js';
import { MetricsRegistry } from '../src/core/observability/metrics.js';
import { retry } from '../src/core/queue/retry-policy.js';
import { ApiKeyManager } from '../src/core/security/api-key-manager.js';
import { createCsrfToken, verifyCsrfToken } from '../src/core/security/csrf-protection.js';
import { EncryptionService } from '../src/core/security/encryption-service.js';
import { hashPassword, verifyPassword } from '../src/core/security/password-hasher.js';
import { chunk, unique } from '../src/core/utils/array.js';
import { escapeHtml, truncate } from '../src/core/utils/string.js';
import { PaginationSchema } from '../src/core/validation/pagination-schema.js';

test('cache manager serializes values and applies positive TTLs', async () => {
  const values = new Map<string, string>();
  const cache = new CacheManager({
    async get(key) { return values.get(key) ?? null; },
    async set(key, value) { values.set(key, value); },
    async delete(key) { values.delete(key); },
  });
  assert.equal(await cache.get('absent'), undefined);
  await cache.set('entry', { ok: true }, 60);
  assert.deepEqual(await cache.get('entry'), { ok: true });
  await assert.rejects(cache.set('entry', {}, 0), RangeError);
  await cache.delete('entry');
  assert.equal(await cache.get('entry'), undefined);
});

test('async memoization shares an in-flight result and retries rejected work', async () => {
  let calls = 0;
  const memoized = memoizeAsync(async (value: number) => {
    calls += 1;
    return value * 2;
  }, { ttlMs: 1000 });
  assert.deepEqual(await Promise.all([memoized(3), memoized(3)]), [6, 6]);
  assert.equal(calls, 1);

  let attempts = 0;
  const result = await retry(async () => {
    attempts += 1;
    if (attempts === 1) throw new Error('transient');
    return 'done';
  }, { attempts: 2, initialDelayMs: 0, maxDelayMs: 0, factor: 2 });
  assert.equal(result, 'done');
  assert.equal(attempts, 2);
});

test('query builder binds values and validates SQL identifiers', () => {
  const query = new SelectQueryBuilder('users', ['id', 'email'])
    .where('status', '=', 'active')
    .orderBy('id', 'DESC')
    .paginate(10, 20)
    .build();
  assert.equal(query.text, 'SELECT id, email FROM users WHERE status = $1 ORDER BY id DESC LIMIT $2 OFFSET $3');
  assert.deepEqual(query.values, ['active', 10, 20]);
  assert.throws(() => new SelectQueryBuilder('users; DROP TABLE users'), /identifiers/u);
  assert.throws(() => new SelectQueryBuilder('users').where('status', 'OR 1=1' as '=', 'x'), /operator/u);
});

test('event bus delivers events and unsubscribe stops future delivery', async () => {
  const events = new EventBus<{ updated: { id: string } }>();
  const received: string[] = [];
  const unsubscribe = events.on('updated', (payload) => { received.push(payload.id); });
  await events.emit('updated', { id: 'a' });
  unsubscribe();
  await events.emit('updated', { id: 'b' });
  assert.deepEqual(received, ['a']);
});

test('i18n formats interpolated values and falls back to message keys', () => {
  const i18n = new I18nService({ en: { greeting: 'Hello {name}' } });
  assert.equal(i18n.translate('greeting', 'en', { name: 'Mana' }), 'Hello Mana');
  assert.equal(i18n.translate('missing'), 'missing');
});

test('encryption, API keys, CSRF tokens, and password hashes validate securely', async () => {
  const encryption = new EncryptionService(Buffer.alloc(32, 7));
  const ciphertext = encryption.encrypt('sensitive value');
  assert.equal(encryption.decrypt(ciphertext), 'sensitive value');
  assert.throws(() => encryption.decrypt(`${ciphertext}tampered`));

  const keys = new ApiKeyManager('0123456789abcdef0123456789abcdef');
  const issued = keys.create();
  assert.equal(keys.verify(issued.key, issued.digest), true);
  assert.equal(keys.verify('invalid', issued.digest), false);

  const csrf = createCsrfToken();
  assert.equal(verifyCsrfToken(csrf, csrf), true);
  assert.equal(verifyCsrfToken(csrf, createCsrfToken()), false);

  const passwordHash = await hashPassword('correct horse battery staple');
  assert.equal(await verifyPassword('correct horse battery staple', passwordHash), true);
  assert.equal(await verifyPassword('wrong password', passwordHash), false);
});

test('shared validation, pagination, metrics, and collection helpers behave consistently', () => {
  assert.deepEqual(PaginationSchema.parse({}), { page: 1, limit: 25 });
  assert.equal(paginationOffset({ page: 3, limit: 10 }), 20);
  assert.deepEqual(createPagination(['a'], 11, 1, 10).pagination, {
    page: 1, limit: 10, total: 11, total_pages: 2,
  });
  const metrics = new MetricsRegistry();
  metrics.increment('api_requests_total');
  metrics.setGauge('active_connections', 2);
  assert.match(metrics.snapshot().counters.api_requests_total?.toString() ?? '', /^1$/u);
  assert.deepEqual(unique([1, 1, 2]), [1, 2]);
  assert.deepEqual(chunk([1, 2, 3], 2), [[1, 2], [3]]);
  assert.equal(truncate('abcdef', 4), 'abc…');
  assert.equal(escapeHtml('<safe & sound>'), '&lt;safe &amp; sound&gt;');
});
