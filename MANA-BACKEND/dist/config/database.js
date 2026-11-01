import { Pool } from 'pg';
export function createDatabaseRuntimeConfig(env) {
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
export function createDatabasePool(config) {
    const options = {
        connectionString: config.url,
        max: config.poolMax,
        idleTimeoutMillis: config.idleTimeoutMs,
        connectionTimeoutMillis: config.connectionTimeoutMs,
        application_name: config.applicationName,
        ...(config.ssl === 'require' ? { ssl: { rejectUnauthorized: true } } : {}),
    };
    return new Pool(options);
}
//# sourceMappingURL=database.js.map