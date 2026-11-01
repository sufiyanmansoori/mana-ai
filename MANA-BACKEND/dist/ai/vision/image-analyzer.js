export async function analyzeImage(image, prompt, provider, signal) {
    const normalizedPrompt = prompt.trim();
    if (normalizedPrompt.length === 0 || normalizedPrompt.length > 4000) {
        throw new RangeError('Image analysis prompt must be non-empty and at most 4000 characters.');
    }
    const result = (await provider.analyze(image, normalizedPrompt, signal)).trim();
    if (result.length === 0)
        throw new Error('Image analysis provider returned an empty response.');
    return result;
}
//# sourceMappingURL=image-analyzer.js.map