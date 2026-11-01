export function calculateCostUsd(usage, pricing) {
    assertNonNegativeFinite(usage.inputTokens, 'inputTokens');
    assertNonNegativeFinite(usage.outputTokens, 'outputTokens');
    assertNonNegativeFinite(pricing.inputUsdPerMillionTokens, 'inputUsdPerMillionTokens');
    assertNonNegativeFinite(pricing.outputUsdPerMillionTokens, 'outputUsdPerMillionTokens');
    return (usage.inputTokens * pricing.inputUsdPerMillionTokens +
        usage.outputTokens * pricing.outputUsdPerMillionTokens) / 1_000_000;
}
function assertNonNegativeFinite(value, name) {
    if (!Number.isFinite(value) || value < 0) {
        throw new RangeError(`${name} must be a finite non-negative number.`);
    }
}
//# sourceMappingURL=cost-calculator.js.map