export declare function successResponse<T>(data: T): {
    data: T;
};
export declare function paginatedResponse<T>(data: T[], pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
}): {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        total_pages: number;
    };
};
export declare function errorResponse(code: string, message: string, requestId?: string): {
    error: {
        request_id?: string;
        code: string;
        message: string;
    };
};
