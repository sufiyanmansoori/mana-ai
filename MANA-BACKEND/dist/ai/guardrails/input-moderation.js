export async function moderateInput(text, provider, signal) {
    if (text.trim().length === 0)
        return { flagged: false, categories: [] };
    const result = await provider.moderate(text, signal);
    return {
        flagged: result.flagged,
        categories: [...new Set(result.categories ?? [])].sort(),
    };
}
//# sourceMappingURL=input-moderation.js.map