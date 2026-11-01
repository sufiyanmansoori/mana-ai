export interface PaginationInput {
  page: number;
  limit: number;
}

export function paginationOffset(input: PaginationInput): number {
  if (
    !Number.isSafeInteger(input.page) || input.page < 1 ||
    !Number.isSafeInteger(input.limit) || input.limit < 1
  ) throw new RangeError('Page and limit must be positive integers.');
  const offset = (input.page - 1) * input.limit;
  if (!Number.isSafeInteger(offset)) throw new RangeError('Pagination offset exceeds safe integer range.');
  return offset;
}

export function createPagination<T>(data: T[], total: number, page: number, limit: number) {
  if (!Number.isSafeInteger(total) || total < 0) throw new RangeError('Total must be non-negative.');
  paginationOffset({ page, limit });
  return { data, pagination: { page, limit, total, total_pages: Math.ceil(total / limit) } };
}
