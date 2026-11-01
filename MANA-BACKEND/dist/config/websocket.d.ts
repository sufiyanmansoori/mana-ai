import type { ParsedEnvironment } from './env-schema.js';
export interface WebSocketRuntimeConfig {
    enabled: boolean;
    maximumConnections: number;
    heartbeatMs: number;
    maximumMessageBytes: number;
}
export declare function createWebSocketRuntimeConfig(env: ParsedEnvironment): WebSocketRuntimeConfig;
