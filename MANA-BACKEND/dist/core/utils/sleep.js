export function sleep(milliseconds, signal) {
    if (!Number.isFinite(milliseconds) || milliseconds < 0) {
        return Promise.reject(new RangeError('Sleep duration must not be negative.'));
    }
    const abortSignal = signal;
    if (abortSignal?.aborted)
        return Promise.reject(abortSignal.reason);
    return new Promise((resolve, reject) => {
        const onAbort = () => {
            clearTimeout(timer);
            abortSignal?.removeEventListener('abort', onAbort);
            reject(abortSignal?.reason);
        };
        const timer = setTimeout(() => {
            abortSignal?.removeEventListener('abort', onAbort);
            resolve();
        }, milliseconds);
        abortSignal?.addEventListener('abort', onAbort, { once: true });
    });
}
//# sourceMappingURL=sleep.js.map