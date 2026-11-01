export function truncateHistory(messages, limits) {
    if (!Number.isInteger(limits.maxMessages) || limits.maxMessages < 1) {
        throw new RangeError('maxMessages must be a positive integer.');
    }
    if (!Number.isInteger(limits.maxCharacters) || limits.maxCharacters < 1) {
        throw new RangeError('maxCharacters must be a positive integer.');
    }
    const system = messages.find((message) => message.role === 'system');
    const conversation = messages.filter((message) => message !== system);
    const retained = [];
    let characterCount = system?.content.length ?? 0;
    const messageCapacity = limits.maxMessages - (system ? 1 : 0);
    const recentMessages = messageCapacity > 0 ? conversation.slice(-messageCapacity) : [];
    for (const message of recentMessages.reverse()) {
        if (characterCount + message.content.length > limits.maxCharacters)
            break;
        retained.push(message);
        characterCount += message.content.length;
    }
    retained.reverse();
    if (system && system.content.length <= limits.maxCharacters) {
        return [system, ...retained];
    }
    return retained;
}
//# sourceMappingURL=history-truncator.js.map