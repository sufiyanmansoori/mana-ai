import type { Router } from 'express';

export class RouterRegistry {
  private readonly entries = new Map<string, Router>();

  register(path: string, router: Router): this {
    if (!path.startsWith('/') || path === '/' || this.entries.has(path)) {
      throw new Error(`Invalid or duplicate router path: ${path}`);
    }
    this.entries.set(path, router);
    return this;
  }

  list(): ReadonlyArray<{ path: string; router: Router }> {
    return [...this.entries].map(([path, router]) => ({ path, router }));
  }
}
