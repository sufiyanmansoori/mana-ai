import type { AppConfig } from '../../config.js';
import type { AiCompletionProvider } from './base-provider.provider.js';
export type AiProviderId = AppConfig['aiProvider'];
export declare class ProviderRegistry {
    private readonly providers;
    constructor(entries: readonly (readonly [AiProviderId, AiCompletionProvider])[]);
    get(id: AiProviderId): AiCompletionProvider;
    list(): AiProviderId[];
}
export declare function createProviderRegistry(config: AppConfig): ProviderRegistry;
