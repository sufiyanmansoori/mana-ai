import { DEFAULT_LOCALE, isSupportedLocale } from '../../constants/locales.js';
export function detectLocale(request, fallback = DEFAULT_LOCALE) {
    const candidate = request.get('accept-language')
        ?.split(',')[0]?.split(';')[0]?.trim();
    if (!candidate)
        return fallback;
    const normalized = candidate.toLowerCase();
    if (isSupportedLocale(normalized))
        return normalized;
    const base = normalized.split('-')[0];
    return base && isSupportedLocale(base) ? base : fallback;
}
//# sourceMappingURL=locale-detector.js.map