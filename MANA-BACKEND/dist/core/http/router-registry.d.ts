import type { Router } from 'express';
export declare class RouterRegistry {
    private readonly entries;
    register(path: string, router: Router): this;
    list(): ReadonlyArray<{
        path: string;
        router: Router;
    }>;
}
