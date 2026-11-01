import type { AppConfig } from '../../config.js';
import { OpenAiCompatibleProvider } from '../../chat/openai-compatible-provider.js';

export class MistralProvider extends OpenAiCompatibleProvider {
  constructor(config: AppConfig, fetchImplementation: typeof fetch = fetch) {
    super({ ...config, aiBaseUrl: 'https://api.mistral.ai/v1' }, fetchImplementation);
  }
}
