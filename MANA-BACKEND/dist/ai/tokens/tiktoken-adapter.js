export function createTiktokenCounter(encoding) {
    return {
        count(text) {
            return encoding.encode(text).length;
        },
    };
}
//# sourceMappingURL=tiktoken-adapter.js.map