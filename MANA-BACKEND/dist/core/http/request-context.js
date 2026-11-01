import { AsyncLocalStorage } from 'node:async_hooks';
import { randomUUID } from 'node:crypto';
const context = new AsyncLocalStorage();
export function runWithRequestContext(value, operation) {
    return context.run({ requestId: value.requestId ?? randomUUID(), ...value }, operation);
}
export function getRequestContext() {
    return context.getStore();
}
//# sourceMappingURL=request-context.js.map