export async function withTransaction(pool, operation) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        try {
            const result = await operation(client);
            await client.query('COMMIT');
            return result;
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
//# sourceMappingURL=transaction.js.map