import { UNTRUSTED_CONTEXT_INSTRUCTION } from './system-prompts.js';
export function buildContextMessage(documents) {
    if (documents.length === 0)
        return undefined;
    const serialized = documents.map((document, index) => JSON.stringify({
        index: index + 1,
        id: document.id,
        text: document.text,
    }));
    return `${UNTRUSTED_CONTEXT_INSTRUCTION}\n${serialized.join('\n')}`;
}
//# sourceMappingURL=context-builder.js.map