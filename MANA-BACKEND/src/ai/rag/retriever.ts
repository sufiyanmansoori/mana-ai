import type { EmbeddingProvider } from './embedder.js';
import { embedTexts } from './embedder.js';
import { rerankByTermOverlap } from './reranker.js';
import type { VectorSearchResult, VectorStore } from './vector-store.js';

export async function retrieveContext(
  query: string,
  ownerSubject: string,
  dependencies: {
    embedder: EmbeddingProvider;
    store: VectorStore;
    limit: number;
    signal?: AbortSignal;
  },
): Promise<VectorSearchResult[]> {
  const [embedding] = await embedTexts([query], dependencies.embedder, dependencies.signal);
  if (!embedding) return [];
  const candidates = await dependencies.store.search(ownerSubject, embedding, dependencies.limit);
  return rerankByTermOverlap(query, candidates).slice(0, dependencies.limit);
}
