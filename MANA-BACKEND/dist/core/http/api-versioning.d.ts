import type { RequestHandler, Router } from 'express';
export declare function mountApiVersion(app: {
    use(path: string, router: Router): unknown;
}, version: number, router: Router): void;
export declare const requireAcceptHeader: RequestHandler;
