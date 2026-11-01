import type { IncomingMessage, Server } from 'node:http';
import type { Duplex } from 'node:stream';
export interface WebSocketAdapter {
    handleUpgrade(request: IncomingMessage, socket: Duplex, head: Buffer): void;
    close(): Promise<void>;
}
export declare function attachWebSocketServer(server: Server, adapter: WebSocketAdapter): () => Promise<void>;
