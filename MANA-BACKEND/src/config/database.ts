import { Pool, type PoolConfig } from 'pg';

export interface DatabaseRuntimeConfig {
  url: string;
  ssl: 'disable' | 'require';
  poolMax: number;
  idleTimeoutMs: number;
  connectionTimeoutMs: number;
  applicationName: string;
}

export function createDatabaseRuntimeConfig(env: {
  NODE_ENV: 'development' | 'test' | 'production';
  DATABASE_URL: string;
  DATABASE_SSL: 'disable' | 'require';
  DATABASE_POOL_MAX: number;
  DATABASE_IDLE_TIMEOUT_MS: number;
  DATABASE_CONNECT_TIMEOUT_MS: number;
  DATABASE_APPLICATION_NAME: string;
}): DatabaseRuntimeConfig {
  if (env.NODE_ENV === 'production' && env.DATABASE_SSL !== 'require') {
    throw new Error('Production database connections must require TLS.');
  }
  return {
    url: env.DATABASE_URL,
    ssl: env.DATABASE_SSL,
    poolMax: env.DATABASE_POOL_MAX,
    idleTimeoutMs: env.DATABASE_IDLE_TIMEOUT_MS,
    connectionTimeoutMs: env.DATABASE_CONNECT_TIMEOUT_MS,
    applicationName: env.DATABASE_APPLICATION_NAME,
  };
}

export function createDatabasePool(config: DatabaseRuntimeConfig): Pool {
  const options: PoolConfig = {
    connectionString: config.url,
    max: config.poolMax,
    idleTimeoutMillis: config.idleTimeoutMs,
    connectionTimeoutMillis: config.connectionTimeoutMs,
    application_name: config.applicationName,
    ...(config.ssl === 'require' ? { ssl: { rejectUnauthorized: true } } : {}),
  };
  return new Pool(options);
}
