export interface QueueAdapter<Job> {
    enqueue(job: Job): Promise<void>;
    close(): Promise<void>;
}
export declare function createQueue<Job>(adapter: QueueAdapter<Job>): QueueAdapter<Job>;
