export interface ModelPricing {
  inputUsdPerMillionTokens: number;
  outputUsdPerMillionTokens: number;
}

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
}

export function calculateCostUsd(usage: TokenUsage, pricing: ModelPricing): number {
  assertNonNegativeFinite(usage.inputTokens, 'inputTokens');
  assertNonNegativeFinite(usage.outputTokens, 'outputTokens');
  assertNonNegativeFinite(pricing.inputUsdPerMillionTokens, 'inputUsdPerMillionTokens');
  assertNonNegativeFinite(pricing.outputUsdPerMillionTokens, 'outputUsdPerMillionTokens');
  return (
    usage.inputTokens * pricing.inputUsdPerMillionTokens +
    usage.outputTokens * pricing.outputUsdPerMillionTokens
  ) / 1_000_000;
}

function assertNonNegativeFinite(value: number, name: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${name} must be a finite non-negative number.`);
  }
}
