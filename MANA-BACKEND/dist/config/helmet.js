export function createHelmetRuntimeConfig(env) {
    return {
        contentSecurityPolicy: env.HELMET_CSP_ENABLED,
        hstsMaxAgeSeconds: env.HELMET_HSTS_MAX_AGE_SECONDS,
    };
}
//# sourceMappingURL=helmet.js.map