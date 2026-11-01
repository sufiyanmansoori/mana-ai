export function createCdnRuntimeConfig(env) {
    if (/\r|\n/u.test(env.CDN_CACHE_CONTROL)) {
        throw new Error('CDN_CACHE_CONTROL must be a single HTTP header value.');
    }
    if (env.CDN_BASE_URL) {
        const url = new URL(env.CDN_BASE_URL);
        if (!['http:', 'https:'].includes(url.protocol)) {
            throw new Error('CDN_BASE_URL must use HTTP or HTTPS.');
        }
        if (url.username || url.password || url.search || url.hash) {
            throw new Error('CDN_BASE_URL must not contain credentials, query parameters, or a fragment.');
        }
        if (env.NODE_ENV === 'production' && url.protocol !== 'https:') {
            throw new Error('Production CDN_BASE_URL must use HTTPS.');
        }
    }
    return {
        enabled: Boolean(env.CDN_BASE_URL),
        ...(env.CDN_BASE_URL ? { baseUrl: env.CDN_BASE_URL.replace(/\/+$/u, '') } : {}),
        cacheControl: env.CDN_CACHE_CONTROL,
    };
}
//# sourceMappingURL=cdn.js.map