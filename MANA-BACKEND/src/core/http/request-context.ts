import { AsyncLocalStorage } from 'node:async_hooks';
import { randomUUID } from 'node:crypto';

export interface RequestContext {
  requestId: string;
  subject?: string;
}

const context = new AsyncLocalStorage<RequestContext>();

export function runWithRequestContext<T>(value: Partial<RequestContext>, operation: () => T): T {
  return context.run({ requestId: value.requestId ?? randomUUID(), ...value }, operation);
}

export function getRequestContext(): RequestContext | undefined {
  return context.getStore();
}
