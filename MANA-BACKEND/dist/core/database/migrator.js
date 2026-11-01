export async function runMigrations(pool, migrations) {
    const client = await pool.connect();
    let locked = false;
    try {
        await client.query('SELECT pg_advisory_lock($1)', [74103219]);
        locked = true;
        await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version text PRIMARY KEY,
        applied_at timestamptz NOT NULL DEFAULT now()
      )
    `);
        for (const migration of migrations) {
            if (!migration.version.trim() || !migration.sql.trim()) {
                throw new TypeError('Migration version and SQL are required.');
            }
            const applied = await client.query('SELECT 1 FROM schema_migrations WHERE version = $1', [migration.version]);
            if (applied.rowCount)
                continue;
            await client.query('BEGIN');
            try {
                await client.query(migration.sql);
                await client.query('INSERT INTO schema_migrations (version) VALUES ($1)', [migration.version]);
                await client.query('COMMIT');
            }
            catch (error) {
                await client.query('ROLLBACK');
                throw error;
            }
        }
    }
    finally {
        try {
            if (locked)
                await client.query('SELECT pg_advisory_unlock($1)', [74103219]);
        }
        finally {
            client.release();
        }
    }
}
//# sourceMappingURL=migrator.js.map