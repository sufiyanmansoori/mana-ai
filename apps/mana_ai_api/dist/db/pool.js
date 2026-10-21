import { Pool } from 'pg';
export function createPool(config) {
    const options = {
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
//# sourceMappingURL=pool.js.map