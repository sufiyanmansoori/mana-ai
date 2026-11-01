import { AppError } from './app-error.js';
export class AiProviderError extends AppError {
    constructor(message, options) {
        super(502, 'ai_provider_error', message, options);
        this.name = 'AiProviderError';
    }
}
//# sourceMappingURL=ai-provider-error.js.map