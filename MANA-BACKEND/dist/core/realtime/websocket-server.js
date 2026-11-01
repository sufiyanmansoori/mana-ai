export function attachWebSocketServer(server, adapter) {
    const onUpgrade = (request, socket, head) => {
        adapter.handleUpgrade(request, socket, head);
    };
    server.on('upgrade', onUpgrade);
    return async () => {
        server.off('upgrade', onUpgrade);
        await adapter.close();
    };
}
//# sourceMappingURL=websocket-server.js.map