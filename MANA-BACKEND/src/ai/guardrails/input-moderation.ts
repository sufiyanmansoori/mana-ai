export interface ModerationFinding {
  flagged: boolean;
  categories?: readonly string[];
}

export interface ModerationProvider {
  moderate(text: string, signal?: AbortSignal): Promise<ModerationFinding>;
}

export async function moderateInput(
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
