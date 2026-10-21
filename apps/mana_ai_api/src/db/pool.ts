import { Pool, type PoolConfig } from 'pg';
import type { AppConfig } from '../config.js';

export function createPool(config: AppConfig): Pool {
  const options: PoolConfig = {
    connectionString: config.databaseUrl,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    application_name: 'mana-ai-api',
    ...(config.databaseSsl === 'require'
      ? { ssl: { rejectUnauthorized: true } }
      : {}),
  };
  return new Pool(options);
}
