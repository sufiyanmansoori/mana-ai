export type Unsubscribe = () => Promise<void>;

export interface PubSubClient {
  publish<T>(topic: string, message: T): Promise<void>;
  subscribe<T>(topic: string, handler: (message: T) => void | Promise<void>): Promise<Unsubscribe>;
}

export class InMemoryPubSub implements PubSubClient {
  private readonly handlers = new Map<string, Set<(message: unknown) => void | Promise<void>>>();

  async publish<T>(topic: string, message: T): Promise<void> {
    validateTopic(topic);
    const handlers = [...(this.handlers.get(topic) ?? [])];
    const results = await Promise.allSettled(
      handlers.map((handler) => Promise.resolve().then(() => handler(message))),
    );
    const errors = results
      .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
      .map((result) => result.reason);
    if (errors.length > 0) {
      throw new AggregateError(errors, `One or more subscribers failed for topic "${topic}".`);
    }
  }

  async subscribe<T>(
    topic: string,
    handler: (message: T) => void | Promise<void>,
  ): Promise<Unsubscribe> {
    validateTopic(topic);
    const topicHandlers = this.handlers.get(topic) ?? new Set();
    const registered = handler as (message: unknown) => void | Promise<void>;
    topicHandlers.add(registered);
    this.handlers.set(topic, topicHandlers);
    return async () => {
      topicHandlers.delete(registered);
      if (topicHandlers.size === 0) this.handlers.delete(topic);
    };
  }
}

function validateTopic(topic: string): void {
  if (topic.trim().length === 0) throw new TypeError('Pub/sub topic is required.');
}
