export function debounce(operation, delayMs) {
    if (!Number.isFinite(delayMs) || delayMs < 0)
        throw new RangeError('Debounce delay must not be negative.');
    let timer;
    return (...args) => {
        if (timer)
            clearTimeout(timer);
        timer = setTimeout(() => {
            timer = undefined;
            operation(...args);
        }, delayMs);
    };
}
//# sourceMappingURL=debounce.js.map