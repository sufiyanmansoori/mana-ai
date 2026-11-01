import type { TelemetryAdapter } from './opentelemetry.js';
export declare function traceOperation<T>(telemetry: TelemetryAdapter | undefined, name: string, operation: () => Promise<T>): Promise<T>;
export declare function currentTraceContext(): import("../http/request-context.js").RequestContext | undefined;
