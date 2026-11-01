export function serializeRequest(request) {
    return { method: request.method, url: request.originalUrl, requestId: request.requestId };
}
export function serializeError(error) {
    if (error instanceof Error)
        return { name: error.name, message: error.message };
    return { message: String(error) };
}
//# sourceMappingURL=serializers.js.map