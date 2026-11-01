export type PromptInjectionSignal =
  | 'instruction_override'
  | 'untrusted_content_escape'
  | 'tool_directive';

const SIGNAL_PATTERNS: readonly [PromptInjectionSignal, RegExp][] = [
  ['instruction_override', /\b(ignore|override|disregard)\b.{0,48}\b(instructions|rules|system)\b/iu],
  ['untrusted_content_escape', /<\/?(?:system|assistant|developer|tool)\b[^>]*>/iu],
  ['tool_directive', /\b(call|invoke|run|execute)\b.{0,32}\b(tool|function|browser|shell)\b/iu],
];

export function detectPromptInjectionSignals(text: string): PromptInjectionSignal[] {
  return SIGNAL_PATTERNS
    .filter(([, pattern]) => pattern.test(text))
    .map(([signal]) => signal);
}
