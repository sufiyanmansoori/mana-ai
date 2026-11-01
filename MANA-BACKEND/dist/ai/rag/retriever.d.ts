import type { EmbeddingProvider } from './embedder.js';
import type { VectorSearchResult, VectorStore } from './vector-store.js';
export declare function retrieveContext(query: string, ownerSubject: string, dependencies: {
    embedder: EmbeddingProvider;
    store: VectorStore;
    limit: number;
    signal?: AbortSignal;
}): Promise<VectorSearchResult[]>;
