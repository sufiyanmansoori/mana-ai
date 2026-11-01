export async function executeFallbackChain<T, Result>(
  routes: readonly T[],
  execute: (route: T) => Promise<Result>,
  canFallback: (error: unknown, route: T, nextRoute: T | undefined) => boolean,
  signal?: AbortSignal,
): Promise<Result> {
  if (routes.length === 0) throw new RangeError('At least one fallback route is required.');
  let lastError: unknown;

  for (let index = 0; index < routes.length; index += 1) {
    if (signal?.aborted) throw signal.reason;
    const route = routes[index];
    if (route === undefined) continue;
    try {
      return await execute(route);
    } catch (error) {
      lastError = error;
      const nextRoute = routes[index + 1];
      if (nextRoute === undefined || !canFallback(error, route, nextRoute)) throw error;
    }
  }

  throw lastError ?? new Error('No fallback route could be executed.');
}
