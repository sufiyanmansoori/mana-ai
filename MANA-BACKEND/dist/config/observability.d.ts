import type { ParsedEnvironment } from './env-schema.js';
export interface ObservabilityConfig {
    serviceName: string;
    metricsEnabled: boolean;
    otlpEndpoint?: string;
}
export declare function createObservabilityConfig(env: ParsedEnvironment): ObservabilityConfig;
