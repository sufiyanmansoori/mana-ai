import type { ProviderMessage } from '../providers/base-provider.provider.js';

export interface TokenCounter {
  count(text: string): number;
}

export function estimateTokenCount(text: string): number {
  const normalized = text.trim();
  if (normalized.length === 0) return 0;
  return Math.ceil(normalized.split(/\s+/u).reduce((total, word) => {
    const wordTokens = Math.max(1, Math.ceil([...word].length / 4));
    return total + wordTokens;
  }, 0));
}

export function estimateMessageTokens(
  messages: readonly ProviderMessage[],
  counter: TokenCounter = { count: estimateTokenCount },
): number {
  return messages.reduce(
    (total, message) => total + counter.count(message.content) + 4,
    2,
  );
}
