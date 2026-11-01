export function createAppRuntimeConfig(env) {
    return {
        environment: env.NODE_ENV,
        host: env.API_HOST,
        port: env.API_PORT,
        shutdownTimeoutMs: env.API_SHUTDOWN_TIMEOUT_MS,
    };
}
//# sourceMappingURL=app.js.map