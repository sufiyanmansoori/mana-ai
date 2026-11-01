export function createRedisClient(config, createAdapter) {
    if (!config.url)
        return undefined;
    return createAdapter(config.url, { keyPrefix: config.keyPrefix });
}
//# sourceMappingURL=redis-client.js.map