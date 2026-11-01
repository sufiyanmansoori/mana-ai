export type Unsubscribe = () => Promise<void>;
export interface PubSubClient {
    publish<T>(topic: string, message: T): Promise<void>;
    subscribe<T>(topic: string, handler: (message: T) => void | Promise<void>): Promise<Unsubscribe>;
}
export declare class InMemoryPubSub implements PubSubClient {
    private readonly handlers;
    publish<T>(topic: string, message: T): Promise<void>;
    subscribe<T>(topic: string, handler: (message: T) => void | Promise<void>): Promise<Unsubscribe>;
}
