export function createFeatureConfig(env) {
    return {
        imageGeneration: env.FEATURE_IMAGE_GENERATION,
        voice: env.FEATURE_VOICE,
        webSearch: env.FEATURE_WEB_SEARCH,
        documentRag: env.FEATURE_DOCUMENT_RAG,
    };
}
//# sourceMappingURL=features.js.map