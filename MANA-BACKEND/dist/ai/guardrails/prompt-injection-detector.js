const SIGNAL_PATTERNS = [
    ['instruction_override', /\b(ignore|override|disregard)\b.{0,48}\b(instructions|rules|system)\b/iu],
    ['untrusted_content_escape', /<\/?(?:system|assistant|developer|tool)\b[^>]*>/iu],
    ['tool_directive', /\b(call|invoke|run|execute)\b.{0,32}\b(tool|function|browser|shell)\b/iu],
];
export function detectPromptInjectionSignals(text) {
    return SIGNAL_PATTERNS
        .filter(([, pattern]) => pattern.test(text))
        .map(([signal]) => signal);
}
//# sourceMappingURL=prompt-injection-detector.js.map