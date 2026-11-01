export interface HealthCheck {
  name: string;
  check(): Promise<void>;
}

export async function runHealthChecks(checks: readonly HealthCheck[]) {
  const results = await Promise.all(checks.map(async ({ name, check }) => {
    try {
      await check();
      return { name, status: 'ok' as const };
    } catch (error) {
      return { name, status: 'error' as const, error };
    }
  }));
  return { status: results.every((result) => result.status === 'ok') ? 'ok' : 'error', checks: results };
}
