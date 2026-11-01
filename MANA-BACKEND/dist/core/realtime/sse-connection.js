export class SseConnection {
    response;
    open = true;
    constructor(response) {
        this.response = response;
        response.status(200).set({
            'Content-Type': 'text/event-stream; charset=utf-8',
            'Cache-Control': 'no-cache, no-transform',
            Connection: 'keep-alive',
            'X-Accel-Buffering': 'no',
        });
        response.flushHeaders();
    }
    send(event) {
        if (!this.open || this.response.writableEnded || this.response.destroyed)
            return false;
        const fields = [];
        if (event.id)
            fields.push(`id: ${event.id}`);
        if (event.event && /^[a-zA-Z0-9_.-]+$/u.test(event.event))
            fields.push(`event: ${event.event}`);
        const data = JSON.stringify(event.data);
        for (const line of data.split(/\r?\n/u))
            fields.push(`data: ${line}`);
        return this.response.write(`${fields.join('\n')}\n\n`);
    }
    close() {
        this.open = false;
        if (!this.response.writableEnded)
            this.response.end();
    }
}
//# sourceMappingURL=sse-connection.js.map