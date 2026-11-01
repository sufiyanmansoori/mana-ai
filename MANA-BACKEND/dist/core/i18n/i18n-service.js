import { DEFAULT_LOCALE, isSupportedLocale } from '../../constants/locales.js';
export class I18nService {
    catalogs;
    fallback;
    constructor(catalogs, fallback = DEFAULT_LOCALE) {
        this.catalogs = catalogs;
        this.fallback = fallback;
    }
    translate(key, locale = this.fallback, values = {}) {
        const language = isSupportedLocale(locale) ? locale : this.fallback;
        const template = this.catalogs[language]?.[key] ?? this.catalogs[this.fallback]?.[key] ?? key;
        return template.replace(/\{([a-zA-Z0-9_]+)\}/gu, (match, name) => Object.hasOwn(values, name) ? String(values[name]) : match);
    }
}
//# sourceMappingURL=i18n-service.js.map