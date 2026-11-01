export async function runSeeder(pool, sql) {
    if (!sql.trim())
        throw new TypeError('Seeder SQL must not be empty.');
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        try {
            await client.query(sql);
            await client.query('COMMIT');
        }
        catch (error) {
            await client.query('ROLLBACK');
            throw error;
        }
    }
    finally {
        client.release();
    }
}
//# sourceMappingURL=seeder.js.map