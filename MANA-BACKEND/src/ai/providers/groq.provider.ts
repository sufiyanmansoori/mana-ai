import type { AppConfig } from '../../config.js';
import { OpenAiCompatibleProvider } from '../../chat/openai-compatible-provider.js';

export class GroqProvider extends OpenAiCompatibleProvider {
  constructor(config: AppConfig, fetchImplementation: typeof fetch = fetch) {
    super({ ...config, aiBaseUrl: 'https://api.groq.com/openai/v1' }, fetchImplementation);
  }
}
