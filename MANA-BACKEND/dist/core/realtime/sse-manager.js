export class SseManager {
    connections = new Map();
    add(topic, connection) {
        let subscribers = this.connections.get(topic);
        if (!subscribers) {
            subscribers = new Set();
            this.connections.set(topic, subscribers);
        }
        subscribers.add(connection);
        return () => {
            subscribers?.delete(connection);
            if (subscribers?.size === 0)
                this.connections.delete(topic);
        };
    }
    publish(topic, event) {
        let delivered = 0;
        for (const connection of this.connections.get(topic) ?? []) {
            if (connection.send(event))
                delivered += 1;
        }
        return delivered;
    }
    closeAll() {
        for (const subscribers of this.connections.values()) {
            for (const connection of subscribers)
                connection.close();
        }
        this.connections.clear();
    }
}
//# sourceMappingURL=sse-manager.js.map