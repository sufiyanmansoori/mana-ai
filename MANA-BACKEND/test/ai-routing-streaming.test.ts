import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Writable } from 'node:stream';
import { writeWithBackpressure } from '../src/ai/streaming/backpressure-controller.js';
import { executeFallbackChain } from '../src/ai/routing/fallback-chain.js';
import { rankRoutesByEstimatedCost } from '../src/ai/routing/cost-optimizer.js';
import { createWeightedLoadBalancer } from '../src/ai/routing/load-balancer.js';
import { selectModelRoute } from '../src/ai/routing/model-router.js';
import { normalizeChunks } from '../src/ai/streaming/chunk-normalizer.js';
import { InMemoryReplayBuffer } from '../src/ai/streaming/stream-recovery.js';
import { formatSseEvent } from '../src/ai/streaming/sse-adapter.js';
import { transformStream } from '../src/ai/streaming/stream-transformer.js';
import { calculateCostUsd } from '../src/ai/tokens/cost-calculator.js';
import { createTiktokenCounter } from '../src/ai/tokens/tiktoken-adapter.js';
import { estimateMessageTokens, estimateTokenCount } from '../src/ai/tokens/token-counter.js';

test('token counting supports injected exact encoders and labels fallback as estimate', () => {
  assert.equal(createTiktokenCounter({ encode: (text) => [...text] }).count('mana'), 4);
  assert.ok(estimateTokenCount('a sentence with several words') > 0);
  assert.equal(estimateMessageTokens([{ role: 'user', content: 'hi' }]), 7);
});

test('cost calculation validates pricing and computes per-million rates', () => {
  assert.equal(calculateCostUsd(
    { inputTokens: 1000, outputTokens: 500 },
    { inputUsdPerMillionTokens: 2, outputUsdPerMillionTokens: 4 },
  ), 0.004);
  assert.throws(() => calculateCostUsd(
    { inputTokens: -1, outputTokens: 0 },
    { inputUsdPerMillionTokens: 1, outputUsdPerMillionTokens: 1 },
  ), RangeError);
});

test('model routing respects capability, enablement and explicit preferences', () => {
  const routes = [
    { id: 'a', provider: 'p1', model: 'm1', enabled: true, capabilities: ['chat'] as const },
    { id: 'b', provider: 'p2', model: 'm2', enabled: true, capabilities: ['chat', 'vision'] as const },
    { id: 'c', provider: 'p3', model: 'm3', enabled: false, capabilities: ['vision'] as const },
  ];
  assert.equal(selectModelRoute(routes, {
    capability: 'chat',
    preferredModel: 'm2',
  }).id, 'b');
  assert.throws(() => selectModelRoute(routes, { capability: 'vision', excludedProviders: ['p2'] }));
});

test('cost optimizer filters and ranks available routes by cost and quality', () => {
  const ranked = rankRoutesByEstimatedCost([
    {
      id: 'cheap', provider: 'p1', model: 'm1', enabled: true, capabilities: ['chat'],
      pricing: { inputUsdPerMillionTokens: 1, outputUsdPerMillionTokens: 1 }, qualityScore: 0.8,
    },
    {
      id: 'best', provider: 'p2', model: 'm2', enabled: true, capabilities: ['chat'],
      pricing: { inputUsdPerMillionTokens: 2, outputUsdPerMillionTokens: 2 }, qualityScore: 0.95,
    },
  ], { inputTokens: 100, outputTokens: 100, minimumQuality: 0.9 });
  assert.deepEqual(ranked.map((route) => route.id), ['best']);
});

test('weighted load balancer follows configured weights', () => {
  const next = createWeightedLoadBalancer([
    { value: 'a', weight: 2 },
    { value: 'b', weight: 1 },
  ]);
  assert.deepEqual([next(), next(), next(), next()], ['a', 'a', 'b', 'a']);
});

test('fallback chain only advances when the caller classifies a failure as safe', async () => {
  const attempts: string[] = [];
  const result = await executeFallbackChain(
    ['primary', 'backup'],
    async (route) => {
      attempts.push(route);
      if (route === 'primary') throw new Error('temporary');
      return 'ok';
    },
    () => true,
  );
  assert.equal(result, 'ok');
  assert.deepEqual(attempts, ['primary', 'backup']);
  await assert.rejects(executeFallbackChain(
    ['primary', 'backup'],
    async () => { throw new Error('permanent'); },
    () => false,
  ), /permanent/u);
});

test('SSE encoder serializes JSON and rejects field injection', () => {
  assert.equal(
    formatSseEvent({ event: 'token', id: '5', data: { text: 'hello' } }),
    'id: 5\nevent: token\ndata: {"text":"hello"}\n\n',
  );
  assert.throws(() => formatSseEvent({ event: 'token\ninjected', data: {} }), TypeError);
});

test('backpressure writer waits for drain and stops on cancellation', async () => {
  const writable = new Writable({
    highWaterMark: 1,
    write(_chunk, _encoding, callback) {
      setTimeout(callback, 1);
    },
  });
  await writeWithBackpressure(writable, 'a chunk larger than the high water mark');
  writable.end();

  const blocked = new Writable({
    highWaterMark: 1,
    write() {},
  });
  const controller = new AbortController();
  const cancelledWrite = writeWithBackpressure(blocked, 'blocked', controller.signal);
  controller.abort(new Error('cancelled'));
  await assert.rejects(cancelledWrite, /cancelled/u);
  blocked.destroy();
});

test('stream normalizer validates completion and output limits', async () => {
  async function* source() {
    yield { content: 'hello', finished: false };
    yield { content: '', finished: true };
  }
  const chunks = [];
  for await (const chunk of normalizeChunks(source(), { maxCharacters: 5 })) chunks.push(chunk);
  assert.deepEqual(chunks, [
    { sequence: 0, content: 'hello', finished: false },
    { sequence: 1, content: '', finished: true },
  ]);
  const limitedStream = async () => {
    let chunkCount = 0;
    for await (const _chunk of normalizeChunks(source(), { maxCharacters: 2 })) chunkCount += 1;
    return chunkCount;
  };
  await assert.rejects(limitedStream, /character limit/u);
});

test('stream transformer maps in order and replay buffer reports evicted cursors', async () => {
  async function* source() {
    yield 1;
    yield 2;
  }
  const transformed = [];
  for await (const item of transformStream(source(), (value) => value * 2)) transformed.push(item);
  assert.deepEqual(transformed, [2, 4]);

  const buffer = new InMemoryReplayBuffer<string>(2);
  buffer.append('one');
  buffer.append('two');
  buffer.append('three');
  assert.deepEqual(buffer.replayAfter(0), {
    events: [{ id: 2, data: 'two' }, { id: 3, data: 'three' }],
    complete: false,
  });
});
