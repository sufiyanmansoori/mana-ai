export type CacheWarmup = () => void | Promise<void>;

export class CacheWarmupRegistry {
  private readonly tasks = new Map<string, CacheWarmup>();
  private started = false;

  register(name: string, warmup: CacheWarmup): void {
    if (this.started) throw new Error('Cache warmups cannot be registered after startup begins.');
    if (name.trim().length === 0) throw new TypeError('Cache warmup name is required.');
    if (this.tasks.has(name)) throw new Error(`Cache warmup "${name}" is already registered.`);
    this.tasks.set(name, warmup);
  }

  async run(): Promise<void> {
    if (this.started) throw new Error('Cache warmups may only be run once.');
    this.started = true;
    const entries = [...this.tasks.entries()];
    const results = await Promise.allSettled(
      entries.map(([, warmup]) => Promise.resolve().then(warmup)),
    );
    const errors = results.flatMap((result, index) =>
      result.status === 'rejected'
        ? [{ name: entries[index]?.[0] ?? 'unknown', error: result.reason }]
        : [],
    );
    if (errors.length > 0) {
      throw new AggregateError(
        errors.map(({ error }) => error),
        `Cache warmup failed for: ${errors.map(({ name }) => name).join(', ')}.`,
      );
    }
  }
}
