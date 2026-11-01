import { ApiError } from '../../errors.js';
export function selectModelRoute(routes, request) {
    const excluded = new Set(request.excludedProviders ?? []);
    const available = routes.filter((route) => route.enabled &&
        route.capabilities.includes(request.capability) &&
        !excluded.has(route.provider));
    const selected = available.find((route) => request.preferredModel !== undefined && route.model === request.preferredModel) ?? available.find((route) => request.preferredProvider !== undefined && route.provider === request.preferredProvider) ?? available[0];
    if (!selected) {
        throw new ApiError(503, 'no_model_route_available', 'No enabled model can satisfy this request.');
    }
    return selected;
}
//# sourceMappingURL=model-router.js.map