export function estimateTokenCount(text) {
    const normalized = text.trim();
    if (normalized.length === 0)
        return 0;
    return Math.ceil(normalized.split(/\s+/u).reduce((total, word) => {
        const wordTokens = Math.max(1, Math.ceil([...word].length / 4));
        return total + wordTokens;
    }, 0));
}
export function estimateMessageTokens(messages, counter = { count: estimateTokenCount }) {
    return messages.reduce((total, message) => total + counter.count(message.content) + 4, 2);
}
//# sourceMappingURL=token-counter.js.map