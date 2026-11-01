export function addMilliseconds(date, milliseconds) {
    if (!Number.isFinite(date.getTime()) || !Number.isFinite(milliseconds)) {
        throw new RangeError('Date and duration must be finite.');
    }
    return new Date(date.getTime() + milliseconds);
}
export function isWithinLast(date, durationMs, now = Date.now()) {
    return date.getTime() <= now && date.getTime() >= now - durationMs;
}
//# sourceMappingURL=date.js.map