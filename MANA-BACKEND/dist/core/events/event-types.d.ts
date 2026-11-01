export type { DomainEventName } from './domain-events.js';
export interface DomainEvent<T = unknown> {
    id: string;
    name: string;
    occurredAt: Date;
    payload: T;
}
