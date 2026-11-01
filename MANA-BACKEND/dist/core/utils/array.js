export function unique(values) {
    return [...new Set(values)];
}
export function chunk(values, size) {
    if (!Number.isSafeInteger(size) || size < 1)
        throw new RangeError('Chunk size must be positive.');
    const result = [];
    for (let index = 0; index < values.length; index += size) {
        result.push(values.slice(index, index + size));
    }
    return result;
}
//# sourceMappingURL=array.js.map