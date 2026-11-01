export class MetricsRegistry {
  private readonly counters = new Map<string, number>();
  private readonly gauges = new Map<string, number>();

  increment(name: string, amount = 1): void {
    this.assertMetric(name, amount);
    this.counters.set(name, (this.counters.get(name) ?? 0) + amount);
  }

  setGauge(name: string, value: number): void {
    this.assertMetric(name, value);
    this.gauges.set(name, value);
  }

  snapshot() {
    return { counters: Object.fromEntries(this.counters), gauges: Object.fromEntries(this.gauges) };
  }

  private assertMetric(name: string, value: number): void {
    if (!/^[a-zA-Z_:][a-zA-Z0-9_:]*$/u.test(name) || !Number.isFinite(value)) {
      throw new TypeError('Metric name or value is invalid.');
    }
  }
}
