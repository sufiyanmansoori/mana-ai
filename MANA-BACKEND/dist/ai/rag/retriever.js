import { embedTexts } from './embedder.js';
import { rerankByTermOverlap } from './reranker.js';
export async function retrieveContext(query, ownerSubject, dependencies) {
    const [embedding] = await embedTexts([query], dependencies.embedder, dependencies.signal);
    if (!embedding)
        return [];
    const candidates = await dependencies.store.search(ownerSubject, embedding, dependencies.limit);
    return rerankByTermOverlap(query, candidates).slice(0, dependencies.limit);
}
//# sourceMappingURL=retriever.js.map