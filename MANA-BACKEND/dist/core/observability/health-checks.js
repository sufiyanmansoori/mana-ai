export async function runHealthChecks(checks) {
    const results = await Promise.all(checks.map(async ({ name, check }) => {
        try {
            await check();
            return { name, status: 'ok' };
        }
        catch (error) {
            return { name, status: 'error', error };
        }
    }));
    return { status: results.every((result) => result.status === 'ok') ? 'ok' : 'error', checks: results };
}
//# sourceMappingURL=health-checks.js.map