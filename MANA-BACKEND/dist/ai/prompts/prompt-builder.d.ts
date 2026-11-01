import type { ProviderMessage } from '../providers/base-provider.provider.js';
import { type ContextDocument } from './context-builder.js';
import { type HistoryLimits } from './history-truncator.js';
export interface PromptInput {
    history: readonly ProviderMessage[];
    userMessage: string;
    persona?: string;
    context?: readonly ContextDocument[];
    systemPrompt?: string;
}
export declare function buildPrompt(input: PromptInput, limits: HistoryLimits): ProviderMessage[];
