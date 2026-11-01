export interface Worker<Job> {
    process(job: Job): Promise<void>;
}
export declare function createWorker<Job>(processor: (job: Job) => Promise<void>): Worker<Job>;
