import type { SseEvent } from './sse-connection.js';
import { SseConnection } from './sse-connection.js';

export class SseManager {
  private readonly connections = new Map<string, Set<SseConnection>>();

  add(topic: string, connection: SseConnection): () => void {
    let subscribers = this.connections.get(topic);
    if (!subscribers) {
      subscribers = new Set();
      this.connections.set(topic, subscribers);
    }
    subscribers.add(connection);
    return () => {
      subscribers?.delete(connection);
      if (subscribers?.size === 0) this.connections.delete(topic);
    };
  }

  publish(topic: string, event: SseEvent): number {
    let delivered = 0;
    for (const connection of this.connections.get(topic) ?? []) {
      if (connection.send(event)) delivered += 1;
    }
    return delivered;
  }

  closeAll(): void {
    for (const subscribers of this.connections.values()) {
      for (const connection of subscribers) connection.close();
    }
    this.connections.clear();
  }
}
