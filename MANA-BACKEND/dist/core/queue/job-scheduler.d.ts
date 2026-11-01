export interface ScheduledJob {
    runAt: Date;
    run(): Promise<void>;
}
export declare function runDueJobs(jobs: readonly ScheduledJob[], now?: Date): Promise<number>;
