export type JailbreakSignal = 'instruction_override' | 'role_override' | 'policy_evasion' | 'secret_extraction';
export declare function detectJailbreakSignals(text: string): JailbreakSignal[];
