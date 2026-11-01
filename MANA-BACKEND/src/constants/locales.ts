export const DEFAULT_LOCALE = 'en';

export const SUPPORTED_LOCALES = ['en', 'hi'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const LOCALE_TAG_PATTERN = /^[a-z]{2,3}(?:-[A-Z]{2})?$/u;

export function isSupportedLocale(locale: string): locale is SupportedLocale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(locale);
}
