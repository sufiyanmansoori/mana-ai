import { randomUUID } from 'node:crypto';

export interface LockStore {
  acquire(key: string, token: string, leaseMs: number): Promise<boolean>;
  release(key: string, token: string): Promise<boolean>;
}

export interface LockOptions {
  leaseMs: number;
  waitMs?: number;
  retryMs?: number;
}

export async function withLock<Result>(
  store: LockStore,
  key: string,
  options: LockOptions,
  operation: () => Promise<Result>,
): Promise<Result> {
  validateKey(key);
  validatePositiveInteger(options.leaseMs, 'leaseMs');
  const waitMs = options.waitMs ?? 0;
  const retryMs = options.retryMs ?? 50;
  if (!Number.isSafeInteger(waitMs) || waitMs < 0) {
    throw new RangeError('Lock waitMs must be a non-negative integer.');
  }
  validatePositiveInteger(retryMs, 'retryMs');

  const token = randomUUID();
  const deadline = Date.now() + waitMs;
  do {
    if (await store.acquire(key, token, options.leaseMs)) {
      let result: Result;
      try {
        result = await operation();
      } catch (operationError) {
        try {
          if (!await store.release(key, token)) {
            throw new Error(`Could not release lock "${key}".`, { cause: operationError });
          }
        } catch (releaseError) {
          throw new AggregateError(
            [operationError, releaseError],
            `Lock operation and release both failed for "${key}".`,
            { cause: releaseError },
          );
        }
        throw new Error(`Lock operation failed for "${key}".`, { cause: operationError });
      }
      if (!await store.release(key, token)) {
        throw new Error(`Could not release lock "${key}".`);
      }
      return result;
    }
    if (Date.now() >= deadline) break;
    await new Promise((resolve) => setTimeout(resolve, Math.min(retryMs, deadline - Date.now())));
  } while (Date.now() <= deadline);

  throw new Error(`Could not acquire lock "${key}" before the wait deadline.`);
}

function validateKey(key: string): void {
  if (key.trim().length === 0) throw new TypeError('Lock key is required.');
}

function validatePositiveInteger(value: number, name: string): void {
  if (!Number.isSafeInteger(value) || value < 1) {
    throw new RangeError(`Lock ${name} must be a positive integer.`);
  }
}
