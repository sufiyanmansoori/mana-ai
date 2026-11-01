export async function mapConcurrent(values, concurrency, operation) {
    if (!Number.isSafeInteger(concurrency) || concurrency < 1) {
        throw new RangeError('Concurrency must be a positive integer.');
    }
    const results = new Array(values.length);
    let nextIndex = 0;
    await Promise.all(Array.from({ length: Math.min(concurrency, values.length) }, async () => {
        while (nextIndex < values.length) {
            const index = nextIndex++;
            results[index] = await operation(values[index], index);
        }
    }));
    return results;
}
//# sourceMappingURL=async.js.map