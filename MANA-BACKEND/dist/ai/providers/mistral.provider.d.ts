import type { AppConfig } from '../../config.js';
import { OpenAiCompatibleProvider } from '../../chat/openai-compatible-provider.js';
export declare class MistralProvider extends OpenAiCompatibleProvider {
    constructor(config: AppConfig, fetchImplementation?: typeof fetch);
}
