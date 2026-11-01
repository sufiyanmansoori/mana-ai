export function createSecurityRuntimeConfig(env) {
    return {
        production: env.NODE_ENV === 'production',
        trustProxyHops: env.API_TRUST_PROXY_HOPS,
        jsonLimitBytes: env.API_BODY_LIMIT_BYTES,
        corsCredentials: false,
        contentSecurityPolicy: true,
    };
}
//# sourceMappingURL=security.js.map