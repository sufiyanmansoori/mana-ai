export function pluralCategory(count: number, locale = 'en'): Intl.LDMLPluralRule {
  if (!Number.isFinite(count)) throw new RangeError('Plural count must be finite.');
  return new Intl.PluralRules(locale).select(count);
}
