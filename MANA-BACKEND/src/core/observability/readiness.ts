import type { Pool } from 'pg';

export async function checkDatabaseReadiness(pool: Pool): Promise<void> {
  await pool.query('SELECT 1');
}
