export async function runDueJobs(jobs, now = new Date()) {
    const due = jobs.filter((job) => job.runAt.getTime() <= now.getTime());
    for (const job of due)
        await job.run();
    return due.length;
}
//# sourceMappingURL=job-scheduler.js.map