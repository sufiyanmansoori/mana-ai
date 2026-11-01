export function startSseHeartbeat(connection, intervalMs = 15000) {
    if (!Number.isSafeInteger(intervalMs) || intervalMs < 1000) {
        throw new RangeError('Heartbeat interval must be at least one second.');
    }
    const timer = setInterval(() => { connection.send({ data: { type: 'ping' } }); }, intervalMs);
    timer.unref();
    return () => clearInterval(timer);
}
//# sourceMappingURL=sse-heartbeat.js.map