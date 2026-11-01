export class ToolRegistry {
    tools = new Map();
    register(tool) {
        if (!/^[a-z][a-z0-9_]{1,63}$/u.test(tool.name)) {
            throw new TypeError('Tool names must be 2-64 lowercase letters, digits, or underscores.');
        }
        if (this.tools.has(tool.name))
            throw new Error(`Tool "${tool.name}" is already registered.`);
        this.tools.set(tool.name, tool);
    }
    get(name) {
        return this.tools.get(name);
    }
    list() {
        return [...this.tools.values()].map(({ name, description }) => ({ name, description }));
    }
}
//# sourceMappingURL=tool-registry.js.map