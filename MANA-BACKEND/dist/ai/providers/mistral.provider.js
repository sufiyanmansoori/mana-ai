import { OpenAiCompatibleProvider } from '../../chat/openai-compatible-provider.js';
export class MistralProvider extends OpenAiCompatibleProvider {
    constructor(config, fetchImplementation = fetch) {
        super({ ...config, aiBaseUrl: 'https://api.mistral.ai/v1' }, fetchImplementation);
    }
}
//# sourceMappingURL=mistral.provider.js.map