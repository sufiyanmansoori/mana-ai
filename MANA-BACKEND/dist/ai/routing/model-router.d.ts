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
export declare function selectModelRoute(routes: readonly ModelRoute[], request: ModelRouteRequest): ModelRoute;
