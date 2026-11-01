const CACHE_KEY_PREFIX = 'mana-ai';
const SAFE_KEY_PART = /^[A-Za-z0-9:_-]{1,200}$/u;

export const CACHE_TTLS_SECONDS = {
  productCategories: 60,
  productCategoriesStaleWhileRevalidate: 300,
  products: 30,
  productsStaleWhileRevalidate: 120,
} as const;

export const CACHE_NAMESPACES = {
  conversation: 'conversation',
  conversationList: 'conversation-list',
  featureFlag: 'feature-flag',
  modelRegistry: 'model-registry',
  product: 'product',
  productCategories: 'product-categories',
  session: 'session',
  userPreferences: 'user-preferences',
} as const;

export type CacheNamespace = (typeof CACHE_NAMESPACES)[keyof typeof CACHE_NAMESPACES];

export function createCacheKey(namespace: CacheNamespace, ...parts: string[]): string {
  if (!SAFE_KEY_PART.test(namespace) || parts.some((part) => !SAFE_KEY_PART.test(part))) {
    throw new TypeError('Cache key parts may contain only letters, digits, colon, underscore, or hyphen.');
  }
  return [CACHE_KEY_PREFIX, namespace, ...parts].join(':');
}
