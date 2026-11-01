import type { Pool } from 'pg';

export async function runSeeder(pool: Pool, sql: string): Promise<void> {
  if (!sql.trim()) throw new TypeError('Seeder SQL must not be empty.');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    try {
      await client.query(sql);
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    }
  } finally {
    client.release();
  }
}
