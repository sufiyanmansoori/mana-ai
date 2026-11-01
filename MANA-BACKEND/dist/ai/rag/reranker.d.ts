import type { VectorSearchResult } from './vector-store.js';
export declare function rerankByTermOverlap(query: string, results: readonly VectorSearchResult[]): VectorSearchResult[];
