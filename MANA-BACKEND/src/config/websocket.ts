import type { ParsedEnvironment } from './env-schema.js';

export interface WebSocketRuntimeConfig {
  enabled: boolean;
  maximumConnections: number;
  heartbeatMs: number;
  maximumMessageBytes: number;
}

export function createWebSocketRuntimeConfig(env: ParsedEnvironment): WebSocketRuntimeConfig {
  return {
    enabled: env.WEBSOCKET_ENABLED,
    maximumConnections: env.WEBSOCKET_MAX_CONNECTIONS,
    heartbeatMs: env.WEBSOCKET_HEARTBEAT_MS,
    maximumMessageBytes: env.WEBSOCKET_MESSAGE_MAX_BYTES,
  };
}
