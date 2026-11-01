import type { MetricsRegistry } from './metrics.js';

export function renderPrometheusMetrics(registry: MetricsRegistry): string {
  const { counters, gauges } = registry.snapshot();
  return [...Object.entries(counters), ...Object.entries(gauges)]
    .map(([name, value]) => `${name} ${value}`)
    .join('\n') + '\n';
}
