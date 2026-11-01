import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';
export declare function validateRequest(input: {
    body?: ZodType;
    query?: ZodType;
    params?: ZodType;
}): RequestHandler;
