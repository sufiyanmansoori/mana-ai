import type { SseEvent } from './sse-connection.js';
import { SseConnection } from './sse-connection.js';
export declare class SseManager {
    private readonly connections;
    add(topic: string, connection: SseConnection): () => void;
    publish(topic: string, event: SseEvent): number;
    closeAll(): void;
}
