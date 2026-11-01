import { createProviderRegistry } from '../ai/providers/provider-registry.provider.js';
export function createChatCompletionProvider(config) {
    return createProviderRegistry(config).get(config.aiProvider);
}
//# sourceMappingURL=provider-factory.js.map