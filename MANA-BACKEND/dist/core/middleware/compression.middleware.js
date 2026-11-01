export function compressionMiddleware(adapter) {
    if (typeof adapter !== 'function')
        throw new TypeError('Provide a configured compression middleware adapter.');
    return adapter;
}
//# sourceMappingURL=compression.middleware.js.map