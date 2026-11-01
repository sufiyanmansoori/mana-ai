import type { Request } from 'express';
export declare function detectLocale(request: Pick<Request, 'get'>, fallback?: string): string;
