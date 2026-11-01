export interface TelemetryAdapter {
    startSpan(name: string): {
        end(): void;
    };
    shutdown(): Promise<void>;
}
export declare function createTelemetryAdapter(adapter?: TelemetryAdapter): TelemetryAdapter | undefined;
