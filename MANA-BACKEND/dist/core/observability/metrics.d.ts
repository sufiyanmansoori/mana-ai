export declare class MetricsRegistry {
    private readonly counters;
    private readonly gauges;
    increment(name: string, amount?: number): void;
    setGauge(name: string, value: number): void;
    snapshot(): {
        counters: {
            [k: string]: number;
        };
        gauges: {
            [k: string]: number;
        };
    };
    private assertMetric;
}
