export function createSearchRuntimeConfig(env) {
    return {
        enabled: env.SEARCH_ENABLED,
        minimumQueryLength: env.SEARCH_MIN_QUERY_LENGTH,
        maximumResults: env.SEARCH_MAX_RESULTS,
        timeoutMs: env.SEARCH_TIMEOUT_MS,
    };
}
//# sourceMappingURL=search.js.map