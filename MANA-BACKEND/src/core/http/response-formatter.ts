export function successResponse<T>(data: T) {
  return { data };
}

export function paginatedResponse<T>(
  data: T[],
  pagination: { page: number; limit: number; total: number; total_pages: number },
) {
  return { data, pagination };
}

export function errorResponse(code: string, message: string, requestId?: string) {
  return { error: { code, message, ...(requestId ? { request_id: requestId } : {}) } };
}
