import { Pool } from 'pg';
import { createDatabasePool } from '../config/database.js';
export function createPool(config) {
    if (config.databaseConfig)
        return createDatabasePool(config.databaseConfig);
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