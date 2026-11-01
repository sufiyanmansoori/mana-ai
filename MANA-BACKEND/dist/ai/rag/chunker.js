export function chunkText(text, options) {
    if (!Number.isInteger(options.maxCharacters) || options.maxCharacters < 1) {
        throw new RangeError('maxCharacters must be a positive integer.');
    }
    if (!Number.isInteger(options.overlapCharacters) ||
        options.overlapCharacters < 0 ||
        options.overlapCharacters >= options.maxCharacters) {
        throw new RangeError('overlapCharacters must be non-negative and smaller than maxCharacters.');
    }
    const normalized = text.replace(/\r\n?/gu, '\n').trim();
    if (normalized.length === 0)
        return [];
    const chunks = [];
    let start = 0;
    while (start < normalized.length) {
        let end = Math.min(start + options.maxCharacters, normalized.length);
        if (end < normalized.length) {
            const boundary = normalized.lastIndexOf('\n', end);
            if (boundary > start + Math.floor(options.maxCharacters / 2))
                end = boundary;
        }
        const content = normalized.slice(start, end).trim();
        if (content.length > 0)
            chunks.push({ index: chunks.length, text: content, start, end });
        if (end >= normalized.length)
            break;
        start = Math.max(start + 1, end - options.overlapCharacters);
    }
    return chunks;
}
//# sourceMappingURL=chunker.js.map