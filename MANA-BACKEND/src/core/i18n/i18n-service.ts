import { DEFAULT_LOCALE, isSupportedLocale, type SupportedLocale } from '../../constants/locales.js';

export type TranslationCatalog = Record<string, string>;

export class I18nService {
  constructor(
    private readonly catalogs: Partial<Record<SupportedLocale, TranslationCatalog>>,
    private readonly fallback: SupportedLocale = DEFAULT_LOCALE,
  ) {}

  translate(key: string, locale: string = this.fallback, values: Record<string, string | number> = {}): string {
    const language = isSupportedLocale(locale) ? locale : this.fallback;
    const template = this.catalogs[language]?.[key] ?? this.catalogs[this.fallback]?.[key] ?? key;
    return template.replace(/\{([a-zA-Z0-9_]+)\}/gu, (match, name: string) =>
      Object.hasOwn(values, name) ? String(values[name]) : match);
  }
}
