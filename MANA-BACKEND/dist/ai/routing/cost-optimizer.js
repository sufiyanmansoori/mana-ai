import { calculateCostUsd } from '../tokens/cost-calculator.js';
export function rankRoutesByEstimatedCost(routes, request) {
    return routes
        .filter((route) => route.enabled &&
        Number.isFinite(route.qualityScore) &&
        route.qualityScore >= (request.minimumQuality ?? 0))
        .map((route) => ({
        ...route,
        estimatedCostUsd: calculateCostUsd(request, route.pricing),
    }))
        .filter((route) => request.maximumCostUsd === undefined ||
        route.estimatedCostUsd <= request.maximumCostUsd)
        .sort((left, right) => left.estimatedCostUsd - right.estimatedCostUsd ||
        right.qualityScore - left.qualityScore);
}
//# sourceMappingURL=cost-optimizer.js.map