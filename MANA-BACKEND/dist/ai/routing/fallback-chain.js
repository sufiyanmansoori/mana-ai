export async function executeFallbackChain(routes, execute, canFallback, signal) {
    if (routes.length === 0)
        throw new RangeError('At least one fallback route is required.');
    let lastError;
    for (let index = 0; index < routes.length; index += 1) {
        if (signal?.aborted)
            throw signal.reason;
        const route = routes[index];
        if (route === undefined)
            continue;
        try {
            return await execute(route);
        }
        catch (error) {
            lastError = error;
            const nextRoute = routes[index + 1];
            if (nextRoute === undefined || !canFallback(error, route, nextRoute))
                throw error;
        }
    }
    throw lastError ?? new Error('No fallback route could be executed.');
}
//# sourceMappingURL=fallback-chain.js.map