import { getRequestContext } from '../http/request-context.js';
import type { TelemetryAdapter } from './opentelemetry.js';

export async function traceOperation<T>(
  telemetry: TelemetryAdapter | undefined,
  name: string,
  operation: () => Promise<T>,
): Promise<T> {
  const span = telemetry?.startSpan(name);
  try {
    return await operation();
  } finally {
    span?.end();
  }
}

export function currentTraceContext() {
  return getRequestContext();
}
