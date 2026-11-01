export function createRegionsRuntimeConfig(env) {
    const available = [...new Set(env.APP_REGIONS.split(',').map((region) => region.trim()).filter(Boolean))];
    if (available.some((region) => !/^[a-z0-9][a-z0-9-]{0,62}$/u.test(region))) {
        throw new Error('APP_REGIONS must contain valid comma-separated region identifiers.');
    }
    if (!available.includes(env.APP_REGION)) {
        throw new Error('APP_REGION must be included in APP_REGIONS.');
    }
    return {
        current: env.APP_REGION,
        available,
        multiRegion: available.length > 1,
    };
}
//# sourceMappingURL=regions.js.map