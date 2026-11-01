import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { Pool } from 'pg';
import { chunkText } from '../src/ai/rag/chunker.js';
import { embedTexts } from '../src/ai/rag/embedder.js';
import { ingestDocument } from '../src/ai/rag/ingestion-pipeline.js';
import { PgVectorStore } from '../src/ai/rag/pgvector-store.js';
import { retrieveContext } from '../src/ai/rag/retriever.js';
import { transcribeAudio } from '../src/ai/speech/stt-service.js';
import { WhisperAdapter } from '../src/ai/speech/whisper-adapter.js';
import { synthesizeSpeech } from '../src/ai/speech/tts-service.js';
import { ElevenLabsAdapter } from '../src/ai/speech/elevenlabs-adapter.js';
import { analyzeImage } from '../src/ai/vision/image-analyzer.js';
import { prepareImage } from '../src/ai/vision/image-preprocessor.js';
import type { VectorRecord, VectorSearchResult, VectorStore } from '../src/ai/rag/vector-store.js';

test('text chunker produces bounded overlapping chunks and handles empty content', () => {
  const chunks = chunkText('First sentence.\nSecond sentence.\nThird sentence.', {
    maxCharacters: 24,
    overlapCharacters: 5,
  });
  assert.ok(chunks.length > 1);
  assert.ok(chunks.every((chunk) => chunk.text.length <= 24));
  assert.deepEqual(chunkText('  ', { maxCharacters: 10, overlapCharacters: 2 }), []);
  assert.throws(() => chunkText('text', { maxCharacters: 5, overlapCharacters: 5 }), RangeError);
});

test('embedding adapter validates count and consistent finite dimensions', async () => {
  assert.deepEqual(await embedTexts(['a', 'b'], {
    async embed() {
      return [[1, 2], [3, 4]];
    },
  }), [[1, 2], [3, 4]]);
  await assert.rejects(embedTexts(['a'], {
    async embed() {
      return [[1], [2]];
    },
  }), /different number/u);
  await assert.rejects(embedTexts(['a'], {
    async embed() {
      return [[Number.NaN]];
    },
  }), /invalid or inconsistent/u);
});

test('pgvector store parameterizes owner filters and rejects unsafe table identifiers', async () => {
  const queries: Array<{ sql: string; values?: readonly unknown[] }> = [];
  const pool = {
    async query(sql: string, values?: readonly unknown[]) {
      queries.push({ sql, values });
      return {
        rows: [{ id: 'chunk-1', document_id: 'doc-1', content: 'matched', score: 0.8 }],
        rowCount: 1,
      };
    },
  } as unknown as Pool;
  const store = new PgVectorStore(pool);
  const results = await store.search('owner-1', [0.1, 0.2], 5);

  assert.deepEqual(results, [{ id: 'chunk-1', documentId: 'doc-1', content: 'matched', score: 0.8 }]);
  assert.match(queries[0]?.sql ?? '', /owner_subject = \$2/u);
  assert.equal(queries[0]?.values?.[1], 'owner-1');
  assert.throws(() => new PgVectorStore(pool, 'chunks; DROP TABLE users'), /SQL identifier/u);
});

test('document ingestion embeds chunks and writes them under the supplied owner', async () => {
  let saved: readonly VectorRecord[] = [];
  const store: VectorStore = {
    async upsert(records) {
      saved = records;
    },
    async search() {
      return [];
    },
  };
  const count = await ingestDocument({
    ownerSubject: 'owner-1',
    documentId: 'doc-1',
    text: 'Some document text, split into manageable sections.',
  }, {
    chunking: { maxCharacters: 20, overlapCharacters: 3 },
    embedder: { async embed(texts) { return texts.map(() => [0.2, 0.8]); } },
    store,
  });

  assert.equal(count, saved.length);
  assert.ok(saved.length > 1);
  assert.ok(saved.every((record) => record.ownerSubject === 'owner-1'));
  assert.ok(saved.every((record) => record.embedding.length === 2));
});

test('retrieval scopes vector search by owner and returns ranked matching chunks', async () => {
  let searchedOwner = '';
  const results: VectorSearchResult[] = [
    { id: '1', documentId: 'd1', content: 'other subject', score: 0.8 },
    { id: '2', documentId: 'd2', content: 'mango mango fruit', score: 0.7 },
  ];
  const store: VectorStore = {
    async upsert() {},
    async search(owner) {
      searchedOwner = owner;
      return results;
    },
  };
  const found = await retrieveContext('mango fruit', 'owner-2', {
    embedder: { async embed() { return [[0.1, 0.9]]; } },
    store,
    limit: 1,
  });
  assert.equal(searchedOwner, 'owner-2');
  assert.equal(found[0]?.id, '2');
});

test('speech service rejects mismatched signatures and accepts valid WAV data', async () => {
  let called = false;
  const provider = {
    async transcribe() {
      called = true;
      return 'recognized words';
    },
  };
  const wav = new Uint8Array([
    0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x41, 0x56, 0x45,
  ]);
  await assert.rejects(transcribeAudio(new Uint8Array([1, 2]), {
    mimeType: 'audio/wav',
    filename: 'recording.wav',
  }, provider), /contents do not match/u);
  assert.equal(called, false);
  assert.equal(await transcribeAudio(wav, {
    mimeType: 'audio/wav',
    filename: 'recording.wav',
  }, provider), 'recognized words');
});

test('Whisper adapter sends multipart audio with credentials kept server-side', async () => {
  let sawFile = false;
  const adapter = new WhisperAdapter({
    apiKey: 'test-secret',
    fetchImplementation: async (_url, init) => {
      const headers = new Headers(init?.headers);
      const body = init?.body as FormData;
      sawFile = headers.get('authorization') === 'Bearer test-secret' &&
        body.get('file') instanceof Blob;
      return Response.json({ text: 'hello' });
    },
  });
  const wav = new Uint8Array([
    0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x41, 0x56, 0x45,
  ]);
  const text = await adapter.transcribe(wav, {
    mimeType: 'audio/wav',
    filename: 'voice.wav',
  });
  assert.equal(text, 'hello');
  assert.equal(sawFile, true);
});

test('speech synthesis service validates voice and response content', async () => {
  assert.deepEqual(await synthesizeSpeech('Hello there', { voiceId: 'voice' }, {
    async synthesize() {
      return new Uint8Array([1, 2, 3]);
    },
  }), new Uint8Array([1, 2, 3]));
  await assert.rejects(synthesizeSpeech(' ', { voiceId: 'voice' }, {
    async synthesize() {
      return new Uint8Array();
    },
  }), RangeError);
});

test('ElevenLabs adapter validates response status and returns audio bytes', async () => {
  let requestedUrl = '';
  const adapter = new ElevenLabsAdapter({
    apiKey: 'test-secret',
    fetchImplementation: async (input) => {
      requestedUrl = String(input);
      return new Response(new Uint8Array([1, 2, 3]), {
        headers: { 'content-type': 'audio/mpeg' },
      });
    },
  });
  const audio = await adapter.synthesize('Hello', { voiceId: 'voice/one' });
  assert.match(requestedUrl, /voice%2Fone/u);
  assert.deepEqual(audio, new Uint8Array([1, 2, 3]));
});

test('image preprocessing verifies signatures and analysis forwards validated input', async () => {
  const png = new Uint8Array(33);
  png.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  png.set([0, 0, 0, 13], 8);
  png.set([0x49, 0x48, 0x44, 0x52], 12);
  const image = prepareImage(png, 'image/png', 1024);
  assert.equal(image.mimeType, 'image/png');
  assert.equal(await analyzeImage(image, 'Describe it', {
    async analyze(input, prompt) {
      assert.equal(input.mimeType, 'image/png');
      assert.equal(prompt, 'Describe it');
      return 'A simple image.';
    },
  }), 'A simple image.');
  assert.throws(() => prepareImage(new Uint8Array([1, 2]), 'image/png', 100), /do not match/u);
});
