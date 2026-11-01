export function createWebSocketRuntimeConfig(env) {
    return {
        enabled: env.WEBSOCKET_ENABLED,
        maximumConnections: env.WEBSOCKET_MAX_CONNECTIONS,
        heartbeatMs: env.WEBSOCKET_HEARTBEAT_MS,
        maximumMessageBytes: env.WEBSOCKET_MESSAGE_MAX_BYTES,
    };
}
//# sourceMappingURL=websocket.js.map