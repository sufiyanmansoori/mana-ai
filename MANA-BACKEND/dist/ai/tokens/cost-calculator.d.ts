export interface ModelPricing {
    inputUsdPerMillionTokens: number;
    outputUsdPerMillionTokens: number;
}
export interface TokenUsage {
    inputTokens: number;
    outputTokens: number;
}
export declare function calculateCostUsd(usage: TokenUsage, pricing: ModelPricing): number;
