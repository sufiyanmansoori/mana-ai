export const DEFAULT_LOCALE = 'en';
export const SUPPORTED_LOCALES = ['en', 'hi'];
export const LOCALE_TAG_PATTERN = /^[a-z]{2,3}(?:-[A-Z]{2})?$/u;
export function isSupportedLocale(locale) {
    return SUPPORTED_LOCALES.includes(locale);
}
//# sourceMappingURL=locales.js.map