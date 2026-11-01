import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { Pool } from 'pg';
import { loadConfig } from '../config.js';
const migrations = [
    '001_initial_schema',
    '002_conversation_organization',
    '003_user_preferences',
    '004_store_catalog',
    '005_admin_feature_flags',
    '006_admin_records',
];
async function migrate() {
    const config = loadConfig();
    const pool = new Pool({
        connectionString: config.databaseUrl,
        ...(config.databaseSsl === 'require'
            ? { ssl: { rejectUnauthorized: true } }
            : {}),
    });
    const client = await pool.connect();
    try {
        await client.query('SELECT pg_advisory_lock($1)', [74103219]);
        await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version text PRIMARY KEY,
        applied_at timestamptz NOT NULL DEFAULT now()
      )
    `);
        for (const version of migrations) {
            const existing = await client.query('SELECT version FROM schema_migrations WHERE version = $1', [version]);
            if (existing.rowCount !== 0)
                continue;
            const migrationUrl = new URL(`./migrations/${version}.sql`, import.meta.url);
            const sql = await readFile(migrationUrl, 'utf8');
            await client.query('BEGIN');
            try {
                await client.query(sql);
                await client.query('INSERT INTO schema_migrations (version) VALUES ($1)', [version]);
                await client.query('COMMIT');
            }
            catch (error) {
                await client.query('ROLLBACK');
                throw error;
            }
        }
        console.info(`Database migrations are applied: ${migrations.join(', ')}.`);
    }
    finally {
        await client.query('SELECT pg_advisory_unlock($1)', [74103219]);
        client.release();
        await pool.end();
    }
}
migrate().catch((error) => {
    console.error('Database migration failed.', error);
    process.exitCode = 1;
});
//# sourceMappingURL=migrate.js.map