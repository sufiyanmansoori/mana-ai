import { type ChunkingOptions } from './chunker.js';
import { type EmbeddingProvider } from './embedder.js';
import type { VectorStore } from './vector-store.js';
export declare function ingestDocument(input: {
    ownerSubject: string;
    documentId: string;
    text: string;
}, dependencies: {
    chunking: ChunkingOptions;
    embedder: EmbeddingProvider;
    store: VectorStore;
    signal?: AbortSignal;
    maximumDocumentCharacters?: number;
}): Promise<number>;
