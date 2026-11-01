import type { ProviderMessage } from '../providers/base-provider.provider.js';
export interface HistoryLimits {
    maxMessages: number;
    maxCharacters: number;
}
export declare function truncateHistory(messages: readonly ProviderMessage[], limits: HistoryLimits): ProviderMessage[];
