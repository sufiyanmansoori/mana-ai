import { calculateCostUsd, type ModelPricing } from '../tokens/cost-calculator.js';
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

export function rankRoutesByEstimatedCost(
  routes: readonly PricedModelRoute[],
  request: CostOptimizationRequest,
): Array<PricedModelRoute & { estimatedCostUsd: number }> {
  return routes
    .filter((route) =>
      route.enabled &&
      Number.isFinite(route.qualityScore) &&
      route.qualityScore >= (request.minimumQuality ?? 0)
    )
    .map((route) => ({
      ...route,
      estimatedCostUsd: calculateCostUsd(request, route.pricing),
    }))
    .filter((route) =>
      request.maximumCostUsd === undefined ||
      route.estimatedCostUsd <= request.maximumCostUsd
    )
    .sort((left, right) =>
      left.estimatedCostUsd - right.estimatedCostUsd ||
      right.qualityScore - left.qualityScore
    );
}
