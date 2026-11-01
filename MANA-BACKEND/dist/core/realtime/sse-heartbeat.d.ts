import type { SseConnection } from './sse-connection.js';
export declare function startSseHeartbeat(connection: SseConnection, intervalMs?: number): () => void;
