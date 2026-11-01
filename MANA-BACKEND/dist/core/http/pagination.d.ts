export interface PaginationInput {
    page: number;
    limit: number;
}
export declare function paginationOffset(input: PaginationInput): number;
export declare function createPagination<T>(data: T[], total: number, page: number, limit: number): {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        total_pages: number;
    };
};
