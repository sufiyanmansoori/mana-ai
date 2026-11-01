import type { IncomingMessage, Server } from 'node:http';
import type { Duplex } from 'node:stream';

export interface WebSocketAdapter {
  handleUpgrade(request: IncomingMessage, socket: Duplex, head: Buffer): void;
  close(): Promise<void>;
}

export function attachWebSocketServer(server: Server, adapter: WebSocketAdapter): () => Promise<void> {
  const onUpgrade = (request: IncomingMessage, socket: Duplex, head: Buffer) => {
    adapter.handleUpgrade(request, socket, head);
  };
  server.on('upgrade', onUpgrade);
  return async () => {
    server.off('upgrade', onUpgrade);
    await adapter.close();
  };
}
