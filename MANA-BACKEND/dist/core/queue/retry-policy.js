export function retryDelay(attempt, policy) {
    if (!Number.isSafeInteger(attempt) || attempt < 1 ||
        !Number.isSafeInteger(policy.attempts) || policy.attempts < 1 ||
        !Number.isFinite(policy.initialDelayMs) || policy.initialDelayMs < 0 ||
        !Number.isFinite(policy.maxDelayMs) || policy.maxDelayMs < 0 ||
        !Number.isFinite(policy.factor) || policy.factor < 1) {
        throw new RangeError('Retry policy values are invalid.');
    }
    return Math.min(policy.maxDelayMs, policy.initialDelayMs * policy.factor ** (attempt - 1));
}
export async function retry(operation, policy, shouldRetry = () => true) {
    let lastError;
    for (let attempt = 1; attempt <= policy.attempts; attempt += 1) {
        try {
            return await operation(attempt);
        }
        catch (error) {
            lastError = error;
            if (attempt === policy.attempts || !shouldRetry(error))
                throw error;
            await new Promise((resolve) => setTimeout(resolve, retryDelay(attempt, policy)));
        }
    }
    throw lastError;
}
//# sourceMappingURL=retry-policy.js.map