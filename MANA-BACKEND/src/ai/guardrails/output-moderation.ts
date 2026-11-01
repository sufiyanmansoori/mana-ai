import type { ModerationFinding, ModerationProvider } from './input-moderation.js';

export async function moderateOutput(
  text: string,
  provider: ModerationProvider,
  signal?: AbortSignal,
): Promise<ModerationFinding> {
  if (text.trim().length === 0) return { flagged: false, categories: [] };
  const result = await provider.moderate(text, signal);
  return {
    flagged: result.flagged,
    categories: [...new Set(result.categories ?? [])].sort(),
  };
}
