import { Pool, type PoolConfig } from 'pg';
import type { AppConfig } from '../config.js';
import { createDatabasePool } from '../config/database.js';

export function createPool(config: AppConfig): Pool {
  if (config.databaseConfig) return createDatabasePool(config.databaseConfig);
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
