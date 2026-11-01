export function renderPrometheusMetrics(registry) {
    const { counters, gauges } = registry.snapshot();
    return [...Object.entries(counters), ...Object.entries(gauges)]
        .map(([name, value]) => `${name} ${value}`)
        .join('\n') + '\n';
}
//# sourceMappingURL=prometheus.js.map