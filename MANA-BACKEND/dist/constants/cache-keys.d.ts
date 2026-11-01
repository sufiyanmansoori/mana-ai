export declare const CACHE_TTLS_SECONDS: {
    readonly productCategories: 60;
    readonly productCategoriesStaleWhileRevalidate: 300;
    readonly products: 30;
    readonly productsStaleWhileRevalidate: 120;
};
export declare const CACHE_NAMESPACES: {
    readonly conversation: "conversation";
    readonly conversationList: "conversation-list";
    readonly featureFlag: "feature-flag";
    readonly modelRegistry: "model-registry";
    readonly product: "product";
    readonly productCategories: "product-categories";
    readonly session: "session";
    readonly userPreferences: "user-preferences";
};
export type CacheNamespace = (typeof CACHE_NAMESPACES)[keyof typeof CACHE_NAMESPACES];
export declare function createCacheKey(namespace: CacheNamespace, ...parts: string[]): string;
