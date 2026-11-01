import { randomUUID } from 'node:crypto';
import { chunkText, type ChunkingOptions } from './chunker.js';
import { embedTexts, type EmbeddingProvider } from './embedder.js';
import type { VectorRecord, VectorStore } from './vector-store.js';

export async function ingestDocument(
  input: { ownerSubject: string; documentId: string; text: string },
  dependencies: {
    chunking: ChunkingOptions;
    embedder: EmbeddingProvider;
    store: VectorStore;
    signal?: AbortSignal;
    maximumDocumentCharacters?: number;
  },
): Promise<number> {
  if (input.ownerSubject.trim().length === 0 || input.documentId.trim().length === 0) {
    throw new TypeError('Document ownership and ID are required.');
  }
  const maximumDocumentCharacters = dependencies.maximumDocumentCharacters ?? 1_000_000;
  if (input.text.length > maximumDocumentCharacters) {
    throw new RangeError('Document exceeds the configured character limit.');
  }
  const chunks = chunkText(input.text, dependencies.chunking);
  if (chunks.length === 0) return 0;
  if (chunks.length > 1000) throw new RangeError('Document produced too many chunks.');

  const embeddings = await embedTexts(
    chunks.map((chunk) => chunk.text),
    dependencies.embedder,
    dependencies.signal,
  );
  const records: VectorRecord[] = chunks.map((chunk, index) => {
    const embedding = embeddings[index];
    if (!embedding) throw new Error('Embedding result is missing for a document chunk.');
    return {
      id: randomUUID(),
      ownerSubject: input.ownerSubject,
      documentId: input.documentId,
      content: chunk.text,
      embedding,
    };
  });
  await dependencies.store.upsert(records);
  return records.length;
}
