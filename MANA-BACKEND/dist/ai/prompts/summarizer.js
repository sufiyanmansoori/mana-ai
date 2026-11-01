export async function summarizeHistory(messages, generate, options) {
    if (!Number.isInteger(options.maxCharacters) || options.maxCharacters < 1) {
        throw new RangeError('maxCharacters must be a positive integer.');
    }
    if (messages.length === 0)
        return '';
    const summary = (await generate(messages, options.signal)).trim();
    if (summary.length === 0) {
        throw new Error('The summary generator returned an empty summary.');
    }
    if (summary.length > options.maxCharacters) {
        throw new RangeError('The generated summary exceeds the configured character limit.');
    }
    return summary;
}
//# sourceMappingURL=summarizer.js.map