import type { PreparedImage } from './image-preprocessor.js';

export interface ImageAnalysisProvider {
  analyze(
    image: PreparedImage,
    prompt: string,
    signal?: AbortSignal,
  ): Promise<string>;
}

export async function analyzeImage(
  image: PreparedImage,
  prompt: string,
  provider: ImageAnalysisProvider,
  signal?: AbortSignal,
): Promise<string> {
  const normalizedPrompt = prompt.trim();
  if (normalizedPrompt.length === 0 || normalizedPrompt.length > 4000) {
    throw new RangeError('Image analysis prompt must be non-empty and at most 4000 characters.');
  }
  const result = (await provider.analyze(image, normalizedPrompt, signal)).trim();
  if (result.length === 0) throw new Error('Image analysis provider returned an empty response.');
  return result;
}
