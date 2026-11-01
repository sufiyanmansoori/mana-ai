export interface ScheduledJob {
  runAt: Date;
  run(): Promise<void>;
}

export async function runDueJobs(jobs: readonly ScheduledJob[], now = new Date()): Promise<number> {
  const due = jobs.filter((job) => job.runAt.getTime() <= now.getTime());
  for (const job of due) await job.run();
  return due.length;
}
