export async function* transformStream(source, transform, signal) {
    let index = 0;
    for await (const item of source) {
        if (signal?.aborted)
            throw signal.reason;
        yield await transform(item, index);
        index += 1;
    }
}
//# sourceMappingURL=stream-transformer.js.map