export class InMemoryPubSub {
    handlers = new Map();
    async publish(topic, message) {
        validateTopic(topic);
        const handlers = [...(this.handlers.get(topic) ?? [])];
        const results = await Promise.allSettled(handlers.map((handler) => Promise.resolve().then(() => handler(message))));
        const errors = results
            .filter((result) => result.status === 'rejected')
            .map((result) => result.reason);
        if (errors.length > 0) {
            throw new AggregateError(errors, `One or more subscribers failed for topic "${topic}".`);
        }
    }
    async subscribe(topic, handler) {
        validateTopic(topic);
        const topicHandlers = this.handlers.get(topic) ?? new Set();
        const registered = handler;
        topicHandlers.add(registered);
        this.handlers.set(topic, topicHandlers);
        return async () => {
            topicHandlers.delete(registered);
            if (topicHandlers.size === 0)
                this.handlers.delete(topic);
        };
    }
}
function validateTopic(topic) {
    if (topic.trim().length === 0)
        throw new TypeError('Pub/sub topic is required.');
}
//# sourceMappingURL=pubsub.js.map