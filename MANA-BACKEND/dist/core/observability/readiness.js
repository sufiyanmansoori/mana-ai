export async function checkDatabaseReadiness(pool) {
    await pool.query('SELECT 1');
}
//# sourceMappingURL=readiness.js.map