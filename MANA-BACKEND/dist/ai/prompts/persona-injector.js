const MAX_PERSONA_CHARACTERS = 4000;
export function buildPersonaInstruction(persona) {
    const normalized = [...persona].filter((character) => {
        const codePoint = character.codePointAt(0) ?? 0;
        return !(codePoint <= 0x08 ||
            codePoint === 0x0b ||
            codePoint === 0x0c ||
            (codePoint >= 0x0e && codePoint <= 0x1f) ||
            codePoint === 0x7f);
    }).join('').trim();
    if (normalized.length === 0)
        return '';
    if (normalized.length > MAX_PERSONA_CHARACTERS) {
        throw new RangeError(`Persona instructions must not exceed ${MAX_PERSONA_CHARACTERS} characters.`);
    }
    return `User-preferred response style (not higher-priority policy):\n${normalized}`;
}
//# sourceMappingURL=persona-injector.js.map