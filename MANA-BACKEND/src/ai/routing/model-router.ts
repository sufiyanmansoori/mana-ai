import { ApiError } from '../../errors.js';

export type ModelCapability = 'chat' | 'vision' | 'tools' | 'json';

export interface ModelRoute {
  id: string;
  provider: string;
  model: string;
  enabled: boolean;
  capabilities: readonly ModelCapability[];
}

export interface ModelRouteRequest {
  capability: ModelCapability;
  preferredModel?: string;
  preferredProvider?: string;
  excludedProviders?: readonly string[];
}

export function selectModelRoute(
  routes: readonly ModelRoute[],
  request: ModelRouteRequest,
): ModelRoute {
  const excluded = new Set(request.excludedProviders ?? []);
  const available = routes.filter((route) =>
    route.enabled &&
    route.capabilities.includes(request.capability) &&
    !excluded.has(route.provider)
  );
  const selected = available.find((route) =>
    request.preferredModel !== undefined && route.model === request.preferredModel
  ) ?? available.find((route) =>
    request.preferredProvider !== undefined && route.provider === request.preferredProvider
  ) ?? available[0];

  if (!selected) {
    throw new ApiError(503, 'no_model_route_available', 'No enabled model can satisfy this request.');
  }
  return selected;
}
