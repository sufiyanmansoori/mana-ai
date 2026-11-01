import { type ModelPricing } from '../tokens/cost-calculator.js';
import type { ModelRoute } from './model-router.js';
export interface PricedModelRoute extends ModelRoute {
    pricing: ModelPricing;
    qualityScore: number;
}
export interface CostOptimizationRequest {
    inputTokens: number;
    outputTokens: number;
    minimumQuality?: number;
    maximumCostUsd?: number;
}
export declare function rankRoutesByEstimatedCost(routes: readonly PricedModelRoute[], request: CostOptimizationRequest): Array<PricedModelRoute & {
    estimatedCostUsd: number;
}>;
