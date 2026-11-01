export interface TelemetryAdapter {
  startSpan(name: string): { end(): void };
  shutdown(): Promise<void>;
}

export function createTelemetryAdapter(adapter?: TelemetryAdapter): TelemetryAdapter | undefined {
  return adapter;
}
