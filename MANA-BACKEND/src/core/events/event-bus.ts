export type EventHandler<T> = (payload: T) => void | Promise<void>;

export class EventBus<Events extends Record<string, unknown>> {
  private readonly handlers = new Map<keyof Events, Set<(payload: unknown) => void | Promise<void>>>();

  on<K extends keyof Events>(name: K, handler: EventHandler<Events[K]>): () => void {
    let listeners = this.handlers.get(name);
    if (!listeners) {
      listeners = new Set();
      this.handlers.set(name, listeners);
    }
    const dispatch = (payload: unknown) => handler(payload as Events[K]);
    listeners.add(dispatch);
    return () => {
      listeners?.delete(dispatch);
      if (listeners?.size === 0) this.handlers.delete(name);
    };
  }

  async emit<K extends keyof Events>(name: K, payload: Events[K]): Promise<void> {
    const listeners = [...(this.handlers.get(name) ?? [])];
    for (const handler of listeners) await handler(payload);
  }
}
