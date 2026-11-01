export interface VectorRecord {
  id: string;
  ownerSubject: string;
  documentId: string;
  content: string;
  embedding: readonly number[];
}

export interface VectorSearchResult {
  id: string;
  documentId: string;
  content: string;
  score: number;
}

export interface VectorStore {
  upsert(records: readonly VectorRecord[]): Promise<void>;
  search(
    ownerSubject: string,
    embedding: readonly number[],
    limit: number,
  ): Promise<VectorSearchResult[]>;
}
