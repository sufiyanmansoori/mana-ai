import { LOCALE_TAG_PATTERN } from '../constants/locales.js';
export function createI18nConfig(env) {
    const supportedLocales = [...new Set(env.SUPPORTED_LOCALES.split(',')
            .map((locale) => locale.trim())
            .filter(Boolean))];
    if (supportedLocales.length === 0 ||
        supportedLocales.some((locale) => !LOCALE_TAG_PATTERN.test(locale)) ||
        !supportedLocales.includes(env.DEFAULT_LOCALE)) {
        throw new Error('SUPPORTED_LOCALES must include DEFAULT_LOCALE.');
    }
    return { defaultLocale: env.DEFAULT_LOCALE, supportedLocales };
}
//# sourceMappingURL=i18n.js.map