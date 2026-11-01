export interface Worker<Job> {
  process(job: Job): Promise<void>;
}

export function createWorker<Job>(
  processor: (job: Job) => Promise<void>,
): Worker<Job> {
  return { process: processor };
}
