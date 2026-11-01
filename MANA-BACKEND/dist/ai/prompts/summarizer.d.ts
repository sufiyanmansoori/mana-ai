import type { ProviderMessage } from '../providers/base-provider.provider.js';
export type SummaryGenerator = (messages: readonly ProviderMessage[], signal?: AbortSignal) => Promise<string>;
export declare function summarizeHistory(messages: readonly ProviderMessage[], generate: SummaryGenerator, options: {
    maxCharacters: number;
    signal?: AbortSignal;
}): Promise<string>;
