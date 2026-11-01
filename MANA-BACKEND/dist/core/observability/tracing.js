import { getRequestContext } from '../http/request-context.js';
export async function traceOperation(telemetry, name, operation) {
    const span = telemetry?.startSpan(name);
    try {
        return await operation();
    }
    finally {
        span?.end();
    }
}
export function currentTraceContext() {
    return getRequestContext();
}
//# sourceMappingURL=tracing.js.map