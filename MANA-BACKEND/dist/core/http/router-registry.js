export class RouterRegistry {
    entries = new Map();
    register(path, router) {
        if (!path.startsWith('/') || path === '/' || this.entries.has(path)) {
            throw new Error(`Invalid or duplicate router path: ${path}`);
        }
        this.entries.set(path, router);
        return this;
    }
    list() {
        return [...this.entries].map(([path, router]) => ({ path, router }));
    }
}
//# sourceMappingURL=router-registry.js.map