import type { Request } from 'express';
export declare function serializeRequest(request: Pick<Request, 'method' | 'originalUrl' | 'requestId'>): {
    method: string;
    url: string;
    requestId: string;
};
export declare function serializeError(error: unknown): {
    name: string;
    message: string;
} | {
    message: string;
    name?: never;
};
