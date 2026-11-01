export async function* normalizeChunks(source, options) {
    if (!Number.isInteger(options.maxCharacters) || options.maxCharacters < 1) {
        throw new RangeError('maxCharacters must be a positive integer.');
    }
    let sequence = 0;
    let characterCount = 0;
    let finished = false;
    for await (const chunk of source) {
        if (finished)
            throw new Error('Provider emitted content after its final chunk.');
        if (typeof chunk.content !== 'string' || typeof chunk.finished !== 'boolean') {
            throw new TypeError('Provider emitted a malformed chunk.');
        }
        characterCount += chunk.content.length;
        if (characterCount > options.maxCharacters) {
            throw new RangeError('Provider stream exceeded the configured character limit.');
        }
        finished = chunk.finished;
        yield { sequence, content: chunk.content, finished };
        sequence += 1;
    }
    if (!finished)
        throw new Error('Provider stream ended without a final chunk.');
}
//# sourceMappingURL=chunk-normalizer.js.map