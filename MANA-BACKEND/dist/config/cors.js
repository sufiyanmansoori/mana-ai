export function parseCorsOrigins(value) {
    const origins = value.split(',').map((item) => item.trim()).filter(Boolean);
    const parsed = origins.map((origin) => {
        let url;
        try {
            url = new URL(origin);
        }
        catch {
            throw new Error(`Invalid CORS origin: ${origin}`);
        }
        if (!['http:', 'https:'].includes(url.protocol) ||
            url.origin !== origin ||
            url.username ||
            url.password) {
            throw new Error(`Invalid CORS origin: ${origin}`);
        }
        return origin;
    });
    if (new Set(parsed).size !== parsed.length)
        throw new Error('CORS origins must be unique.');
    return parsed;
}
//# sourceMappingURL=cors.js.map