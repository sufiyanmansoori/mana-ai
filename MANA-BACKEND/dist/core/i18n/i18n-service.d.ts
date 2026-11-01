import { type SupportedLocale } from '../../constants/locales.js';
export type TranslationCatalog = Record<string, string>;
export declare class I18nService {
    private readonly catalogs;
    private readonly fallback;
    constructor(catalogs: Partial<Record<SupportedLocale, TranslationCatalog>>, fallback?: SupportedLocale);
    translate(key: string, locale?: string, values?: Record<string, string | number>): string;
}
