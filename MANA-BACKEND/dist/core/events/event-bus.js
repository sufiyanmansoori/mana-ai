export class EventBus {
    handlers = new Map();
    on(name, handler) {
        let listeners = this.handlers.get(name);
        if (!listeners) {
            listeners = new Set();
            this.handlers.set(name, listeners);
        }
        const dispatch = (payload) => handler(payload);
        listeners.add(dispatch);
        return () => {
            listeners?.delete(dispatch);
            if (listeners?.size === 0)
                this.handlers.delete(name);
        };
    }
    async emit(name, payload) {
        const listeners = [...(this.handlers.get(name) ?? [])];
        for (const handler of listeners)
            await handler(payload);
    }
}
//# sourceMappingURL=event-bus.js.map