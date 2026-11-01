import { OpenAiCompatibleProvider } from '../../chat/openai-compatible-provider.js';
export class GroqProvider extends OpenAiCompatibleProvider {
    constructor(config, fetchImplementation = fetch) {
        super({ ...config, aiBaseUrl: 'https://api.groq.com/openai/v1' }, fetchImplementation);
    }
}
//# sourceMappingURL=groq.provider.js.map