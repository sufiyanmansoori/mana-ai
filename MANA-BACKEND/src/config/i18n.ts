import type { ParsedEnvironment } from './env-schema.js';
import { LOCALE_TAG_PATTERN } from '../constants/locales.js';

export interface I18nConfig {
  defaultLocale: string;
  supportedLocales: string[];
}

export function createI18nConfig(env: ParsedEnvironment): I18nConfig {
  const supportedLocales = [...new Set(env.SUPPORTED_LOCALES.split(',')
    .map((locale) => locale.trim())
    .filter(Boolean))];
  if (
    supportedLocales.length === 0 ||
    supportedLocales.some((locale) => !LOCALE_TAG_PATTERN.test(locale)) ||
    !supportedLocales.includes(env.DEFAULT_LOCALE)
  ) {
    throw new Error('SUPPORTED_LOCALES must include DEFAULT_LOCALE.');
  }
  return { defaultLocale: env.DEFAULT_LOCALE, supportedLocales };
}
