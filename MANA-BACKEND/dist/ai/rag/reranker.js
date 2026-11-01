export function rerankByTermOverlap(query, results) {
    const terms = new Set(normalizeTerms(query));
    if (terms.size === 0)
        return [...results].sort((left, right) => right.score - left.score);
    return results.map((result) => {
        const contentTerms = new Set(normalizeTerms(result.content));
        let overlap = 0;
        for (const term of terms)
            if (contentTerms.has(term))
                overlap += 1;
        const lexicalScore = overlap / terms.size;
        return { ...result, score: result.score * 0.7 + lexicalScore * 0.3 };
    }).sort((left, right) => right.score - left.score);
}
function normalizeTerms(value) {
    return value.toLocaleLowerCase('en').match(/[\p{L}\p{N}]{2,}/gu) ?? [];
}
//# sourceMappingURL=reranker.js.map