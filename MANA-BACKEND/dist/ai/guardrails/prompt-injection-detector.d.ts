export type PromptInjectionSignal = 'instruction_override' | 'untrusted_content_escape' | 'tool_directive';
export declare function detectPromptInjectionSignals(text: string): PromptInjectionSignal[];
