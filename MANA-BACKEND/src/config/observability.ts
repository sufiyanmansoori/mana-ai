import type { ParsedEnvironment } from './env-schema.js';

export interface ObservabilityConfig {
  serviceName: string;
  metricsEnabled: boolean;
  otlpEndpoint?: string;
}

export function createObservabilityConfig(env: ParsedEnvironment): ObservabilityConfig {
  return {
    serviceName: env.SERVICE_NAME,
    metricsEnabled: env.METRICS_ENABLED,
    ...(env.OTEL_EXPORTER_OTLP_ENDPOINT
      ? { otlpEndpoint: env.OTEL_EXPORTER_OTLP_ENDPOINT }
      : {}),
  };
}
