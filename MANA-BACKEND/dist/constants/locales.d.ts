export declare const DEFAULT_LOCALE = "en";
export declare const SUPPORTED_LOCALES: readonly ["en", "hi"];
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
export declare const LOCALE_TAG_PATTERN: RegExp;
export declare function isSupportedLocale(locale: string): locale is SupportedLocale;
