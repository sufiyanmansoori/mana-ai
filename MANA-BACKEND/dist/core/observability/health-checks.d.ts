export interface HealthCheck {
    name: string;
    check(): Promise<void>;
}
export declare function runHealthChecks(checks: readonly HealthCheck[]): Promise<{
    status: string;
    checks: ({
        name: string;
        status: "ok";
        error?: never;
    } | {
        name: string;
        status: "error";
        error: unknown;
    })[];
}>;
