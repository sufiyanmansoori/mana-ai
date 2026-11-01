export function successResponse(data) {
    return { data };
}
export function paginatedResponse(data, pagination) {
    return { data, pagination };
}
export function errorResponse(code, message, requestId) {
    return { error: { code, message, ...(requestId ? { request_id: requestId } : {}) } };
}
//# sourceMappingURL=response-formatter.js.map