export function formatNumber(value, locale = 'en') {
    return new Intl.NumberFormat(locale).format(value);
}
export function formatDate(value, locale = 'en', options) {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime()))
        throw new RangeError('Date value is invalid.');
    return new Intl.DateTimeFormat(locale, options).format(date);
}
export function formatCurrency(value, currency, locale = 'en') {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);
}
//# sourceMappingURL=formatters.js.map