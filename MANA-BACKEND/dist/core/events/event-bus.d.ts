export type EventHandler<T> = (payload: T) => void | Promise<void>;
export declare class EventBus<Events extends Record<string, unknown>> {
    private readonly handlers;
    on<K extends keyof Events>(name: K, handler: EventHandler<Events[K]>): () => void;
    emit<K extends keyof Events>(name: K, payload: Events[K]): Promise<void>;
}
