export interface RetryPolicy {
  attempts: number;
  initialDelayMs: number;
  maxDelayMs: number;
  factor: number;
}

export function retryDelay(attempt: number, policy: RetryPolicy): number {
  if (!Number.isSafeInteger(attempt) || attempt < 1 ||
      !Number.isSafeInteger(policy.attempts) || policy.attempts < 1 ||
      !Number.isFinite(policy.initialDelayMs) || policy.initialDelayMs < 0 ||
      !Number.isFinite(policy.maxDelayMs) || policy.maxDelayMs < 0 ||
      !Number.isFinite(policy.factor) || policy.factor < 1) {
    throw new RangeError('Retry policy values are invalid.');
  }
  return Math.min(policy.maxDelayMs, policy.initialDelayMs * policy.factor ** (attempt - 1));
}

export async function retry<T>(
  operation: (attempt: number) => Promise<T>,
  policy: RetryPolicy,
  shouldRetry: (error: unknown) => boolean = () => true,
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= policy.attempts; attempt += 1) {
    try {
      return await operation(attempt);
    } catch (error) {
      lastError = error;
      if (attempt === policy.attempts || !shouldRetry(error)) throw error;
      await new Promise((resolve) => setTimeout(resolve, retryDelay(attempt, policy)));
    }
  }
  throw lastError;
}
