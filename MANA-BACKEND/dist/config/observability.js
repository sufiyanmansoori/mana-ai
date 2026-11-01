export function createObservabilityConfig(env) {
    return {
        serviceName: env.SERVICE_NAME,
        metricsEnabled: env.METRICS_ENABLED,
        ...(env.OTEL_EXPORTER_OTLP_ENDPOINT
            ? { otlpEndpoint: env.OTEL_EXPORTER_OTLP_ENDPOINT }
            : {}),
    };
}
//# sourceMappingURL=observability.js.map