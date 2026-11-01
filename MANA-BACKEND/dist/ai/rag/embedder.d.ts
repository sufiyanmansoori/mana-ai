export interface EmbeddingProvider {
    embed(texts: readonly string[], signal?: AbortSignal): Promise<number[][]>;
}
export declare function embedTexts(texts: readonly string[], provider: EmbeddingProvider, signal?: AbortSignal): Promise<number[][]>;
