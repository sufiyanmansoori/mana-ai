import type { ParsedEnvironment } from './env-schema.js';
export interface I18nConfig {
    defaultLocale: string;
    supportedLocales: string[];
}
export declare function createI18nConfig(env: ParsedEnvironment): I18nConfig;
