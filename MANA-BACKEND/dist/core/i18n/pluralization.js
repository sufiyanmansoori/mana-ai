export function pluralCategory(count, locale = 'en') {
    if (!Number.isFinite(count))
        throw new RangeError('Plural count must be finite.');
    return new Intl.PluralRules(locale).select(count);
}
//# sourceMappingURL=pluralization.js.map