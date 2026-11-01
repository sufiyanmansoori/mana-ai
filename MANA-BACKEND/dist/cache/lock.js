import { randomUUID } from 'node:crypto';
export async function withLock(store, key, options, operation) {
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
            let result;
            try {
                result = await operation();
            }
            catch (operationError) {
                try {
                    if (!await store.release(key, token)) {
                        throw new Error(`Could not release lock "${key}".`, { cause: operationError });
                    }
                }
                catch (releaseError) {
                    throw new AggregateError([operationError, releaseError], `Lock operation and release both failed for "${key}".`, { cause: releaseError });
                }
                throw new Error(`Lock operation failed for "${key}".`, { cause: operationError });
            }
            if (!await store.release(key, token)) {
                throw new Error(`Could not release lock "${key}".`);
            }
            return result;
        }
        if (Date.now() >= deadline)
            break;
        await new Promise((resolve) => setTimeout(resolve, Math.min(retryMs, deadline - Date.now())));
    } while (Date.now() <= deadline);
    throw new Error(`Could not acquire lock "${key}" before the wait deadline.`);
}
function validateKey(key) {
    if (key.trim().length === 0)
        throw new TypeError('Lock key is required.');
}
function validatePositiveInteger(value, name) {
    if (!Number.isSafeInteger(value) || value < 1) {
        throw new RangeError(`Lock ${name} must be a positive integer.`);
    }
}
//# sourceMappingURL=lock.js.map