import assert from 'node:assert/strict';
import { test } from 'node:test';
import { CacheManager } from '../src/core/cache/cache-manager.js';
import { cacheAsync } from '../src/cache/cache.decorator.js';
import { invalidateTag, MemoryCacheTagIndex } from '../src/cache/invalidation.js';
import { MemoryCacheStore } from '../src/cache/memory-cache.js';
import { MultiLayerCacheStore } from '../src/cache/multi-layer.js';
import { MemoryRateLimitStore } from '../src/cache/rate-limit-store.js';
import { withLock } from '../src/cache/lock.js';
import { InMemoryPubSub } from '../src/cache/pubsub.js';
import { CacheWarmupRegistry } from '../src/cache/warmup.js';

test('memory cache enforces TTL and evicts least-recently-used entries', async () => {
  let now = 1000;
  const cache = new MemoryCacheStore({ maxEntries: 2, now: () => now });
  await cache.set('first', '1', 10);
  await cache.set('second', '2', 10);
  assert.equal(await cache.get('first'), '1');
  await cache.set('third', '3', 10);
  assert.equal(await cache.get('second'), null);
  now += 10_000;
  assert.equal(await cache.get('first'), null);
  assert.equal(cache.size, 0);
});

test('multi-layer cache populates local storage and deletes from both layers', async () => {
  const local = new MemoryCacheStore();
  const remote = new MemoryCacheStore();
  const cache = new MultiLayerCacheStore(local, remote);
  await remote.set('item', 'value', 30);
  assert.equal(await cache.get('item'), 'value');
  assert.equal(await local.get('item'), 'value');
  await cache.delete('item');
  assert.equal(await local.get('item'), null);
  assert.equal(await remote.get('item'), null);
});

test('cache decorator computes a key and avoids duplicate work', async () => {
  const manager = new CacheManager(new MemoryCacheStore());
  let calls = 0;
  const load = cacheAsync<typeof service, [string], string>(
    manager,
    (id) => `service:${id}`,
    60,
  )(async function (id) {
    calls += 1;
    return `${this.prefix}${id}`;
  });
  const service = { prefix: 'item-' };
  assert.equal(await load.call(service, '42'), 'item-42');
  assert.equal(await load.call(service, '42'), 'item-42');
  assert.equal(calls, 1);
});

test('tag invalidation removes every indexed cache key', async () => {
  const store = new MemoryCacheStore();
  const cache = new CacheManager(store);
  const index = new MemoryCacheTagIndex();
  await cache.set('product:1', { id: 1 }, 60);
  await cache.set('product:2', { id: 2 }, 60);
  await index.add('products', 'product:1');
  await index.add('products', 'product:2');
  assert.equal(await invalidateTag('products', index, cache), 2);
  assert.equal(await cache.get('product:1'), undefined);
  assert.deepEqual(await index.keys('products'), []);
});

test('memory rate limit store increments a fixed window and resets it', async () => {
  let now = 100;
  const store = new MemoryRateLimitStore(() => now);
  assert.deepEqual(await store.increment('user:1', 1000), { count: 1, resetAt: 1100 });
  assert.deepEqual(await store.increment('user:1', 1000), { count: 2, resetAt: 1100 });
  now = 1100;
  assert.deepEqual(await store.increment('user:1', 1000), { count: 1, resetAt: 2100 });
});

test('memory rate limit store fails closed when its bounded capacity is exhausted', async () => {
  let now = 100;
  const store = new MemoryRateLimitStore(() => now, 1);
  await store.increment('user:1', 1000);
  await assert.rejects(store.increment('user:2', 1000), /refusing to bypass rate limits/u);
  now = 1100;
  assert.deepEqual(await store.increment('user:2', 1000), { count: 1, resetAt: 2100 });
});

test('lock helper releases acquired locks when work completes', async () => {
  let held = false;
  const store = {
    async acquire(): Promise<boolean> {
      if (held) return false;
      held = true;
      return true;
    },
    async release(): Promise<boolean> {
      held = false;
      return true;
    },
  };
  assert.equal(await withLock(store, 'resource', { leaseMs: 100 }, async () => 42), 42);
  assert.equal(held, false);
});

test('lock helper preserves work and release errors', async () => {
  const store = {
    async acquire(): Promise<boolean> {
      return true;
    },
    async release(): Promise<boolean> {
      throw new Error('release failed');
    },
  };
  await assert.rejects(
    withLock(store, 'resource', { leaseMs: 100 }, async () => {
      throw new Error('work failed');
    }),
    (error: unknown) =>
      error instanceof AggregateError &&
      error.errors.some((cause) => cause instanceof Error && cause.message === 'work failed') &&
      error.errors.some((cause) => cause instanceof Error && cause.message === 'release failed'),
  );
});

test('in-memory pub/sub supports unsubscribe and reports subscriber failures', async () => {
  const bus = new InMemoryPubSub();
  let received = 0;
  const unsubscribe = await bus.subscribe<number>('events', (value) => {
    received += value;
  });
  await bus.publish('events', 3);
  await unsubscribe();
  await bus.publish('events', 4);
  assert.equal(received, 3);
  await bus.subscribe('broken', () => {
    throw new Error('subscriber failed');
  });
  await assert.rejects(bus.publish('broken', {}), AggregateError);
});

test('cache warmups run once and aggregate failures', async () => {
  const registry = new CacheWarmupRegistry();
  let completed = false;
  registry.register('models', async () => {
    completed = true;
  });
  await registry.run();
  assert.equal(completed, true);
  await assert.rejects(registry.run(), /only be run once/u);

  const failed = new CacheWarmupRegistry();
  failed.register('broken', () => {
    throw new Error('warmup failed');
  });
  await assert.rejects(failed.run(), AggregateError);
});
