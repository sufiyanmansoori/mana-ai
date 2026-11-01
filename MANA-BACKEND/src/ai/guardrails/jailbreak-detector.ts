export type JailbreakSignal =
  | 'instruction_override'
  | 'role_override'
  | 'policy_evasion'
  | 'secret_extraction';

const SIGNAL_PATTERNS: readonly [JailbreakSignal, RegExp][] = [
  ['instruction_override', /\b(ignore|disregard|override|forget)\b.{0,48}\b(previous|prior|above|system|developer)\b/iu],
  ['role_override', /\b(you are now|act as|pretend to be|roleplay as)\b/iu],
  ['policy_evasion', /\b(bypass|circumvent|disable)\b.{0,32}\b(safety|policy|filter|restriction)\b/iu],
  ['secret_extraction', /\b(reveal|print|show|repeat)\b.{0,32}\b(system prompt|hidden instructions|secret key)\b/iu],
];

export function detectJailbreakSignals(text: string): JailbreakSignal[] {
  return SIGNAL_PATTERNS
    .filter(([, pattern]) => pattern.test(text))
    .map(([signal]) => signal);
}
