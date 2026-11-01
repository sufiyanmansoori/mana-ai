export class MetricsRegistry {
    counters = new Map();
    gauges = new Map();
    increment(name, amount = 1) {
        this.assertMetric(name, amount);
        this.counters.set(name, (this.counters.get(name) ?? 0) + amount);
    }
    setGauge(name, value) {
        this.assertMetric(name, value);
        this.gauges.set(name, value);
    }
    snapshot() {
        return { counters: Object.fromEntries(this.counters), gauges: Object.fromEntries(this.gauges) };
    }
    assertMetric(name, value) {
        if (!/^[a-zA-Z_:][a-zA-Z0-9_:]*$/u.test(name) || !Number.isFinite(value)) {
            throw new TypeError('Metric name or value is invalid.');
        }
    }
}
//# sourceMappingURL=metrics.js.map