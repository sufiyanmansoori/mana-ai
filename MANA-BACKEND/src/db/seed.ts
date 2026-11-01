import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { Pool } from 'pg';
import { loadConfig } from '../config.js';

const seeders = ['001_store_catalog'] as const;

async function seed(): Promise<void> {
  const config = loadConfig();
  if (config.nodeEnv === 'production') {
    throw new Error('Sample catalog seeders are disabled in production.');
  }

  const pool = new Pool({
    connectionString: config.databaseUrl,
    ...(config.databaseSsl === 'require'
      ? { ssl: { rejectUnauthorized: true } }
      : {}),
  });
  const client = await pool.connect();

  try {
    await client.query('SELECT pg_advisory_lock($1)', [74103220]);
    for (const seeder of seeders) {
      const seedUrl = new URL(`./seeders/${seeder}.sql`, import.meta.url);
      const sql = await readFile(seedUrl, 'utf8');
      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query('COMMIT');
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      }
    }
    console.info(`Sample data seeders are applied: ${seeders.join(', ')}.`);
  } finally {
    await client.query('SELECT pg_advisory_unlock($1)', [74103220]);
    client.release();
    await pool.end();
  }
}

seed().catch((error: unknown) => {
  console.error('Database seeding failed.', error);
  process.exitCode = 1;
});
