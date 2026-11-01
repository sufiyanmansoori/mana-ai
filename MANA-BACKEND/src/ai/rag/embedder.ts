export interface EmbeddingProvider {
  embed(texts: readonly string[], signal?: AbortSignal): Promise<number[][]>;
}

export async function embedTexts(
  texts: readonly string[],
  provider: EmbeddingProvider,
  signal?: AbortSignal,
): Promise<number[][]> {
  if (texts.length === 0) return [];
  if (texts.some((text) => text.trim().length === 0)) {
    throw new TypeError('Embedding input must not contain empty text.');
  }
  if (signal?.aborted) throw signal.reason;

  const vectors = await provider.embed(texts, signal);
  if (vectors.length !== texts.length) {
    throw new Error('Embedding provider returned a different number of vectors than requested.');
  }
  const dimensions = vectors[0]?.length ?? 0;
  if (dimensions === 0 || vectors.some((vector) =>
    vector.length !== dimensions || vector.some((value) => !Number.isFinite(value))
  )) {
    throw new Error('Embedding provider returned invalid or inconsistent vectors.');
  }
  return vectors;
}
