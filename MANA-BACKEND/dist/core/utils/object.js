export function omit(input, keys) {
    const excluded = new Set(keys);
    return Object.fromEntries(Object.entries(input).filter(([key]) => !excluded.has(key)));
}
export function isPlainObject(value) {
    if (value === null || typeof value !== 'object')
        return false;
    const prototype = Object.getPrototypeOf(value);
    return prototype === Object.prototype || prototype === null;
}
//# sourceMappingURL=object.js.map