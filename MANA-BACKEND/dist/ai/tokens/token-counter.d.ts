import type { ProviderMessage } from '../providers/base-provider.provider.js';
export interface TokenCounter {
    count(text: string): number;
}
export declare function estimateTokenCount(text: string): number;
export declare function estimateMessageTokens(messages: readonly ProviderMessage[], counter?: TokenCounter): number;
