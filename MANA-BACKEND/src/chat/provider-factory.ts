import type { AppConfig } from '../config.js';
import { createProviderRegistry } from '../ai/providers/provider-registry.provider.js';
import type { ChatCompletionProvider } from './provider.js';

export function createChatCompletionProvider(config: AppConfig): ChatCompletionProvider {
  return createProviderRegistry(config).get(config.aiProvider);
}
