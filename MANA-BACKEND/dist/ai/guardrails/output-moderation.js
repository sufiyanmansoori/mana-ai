export async function moderateOutput(text, provider, signal) {
    if (text.trim().length === 0)
        return { flagged: false, categories: [] };
    const result = await provider.moderate(text, signal);
    return {
        flagged: result.flagged,
        categories: [...new Set(result.categories ?? [])].sort(),
    };
}
//# sourceMappingURL=output-moderation.js.map