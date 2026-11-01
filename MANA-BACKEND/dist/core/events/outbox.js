export class PostgresOutbox {
    pool;
    constructor(pool) {
        this.pool = pool;
    }
    async append(event) {
        await this.pool.query(`INSERT INTO event_outbox (event_id, event_name, payload)
       VALUES ($1, $2, $3::jsonb)`, [event.id, event.name, JSON.stringify(event.payload)]);
    }
}
// The outbox table and dispatcher must be provided by an application migration/worker.
//# sourceMappingURL=outbox.js.map