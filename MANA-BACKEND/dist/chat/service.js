import { randomUUID } from 'node:crypto';
import { ApiError } from '../errors.js';
export class ChatService {
    config;
    repository;
    provider;
    constructor(config, repository, provider) {
        this.config = config;
        this.repository = repository;
        this.provider = provider;
    }
    async prepare(subject, input, signal) {
        const model = input.model ?? this.config.aiModel;
        if (!this.config.aiAllowedModels.includes(model)) {
            throw new ApiError(400, 'unsupported_model', 'The requested model is not enabled for this API.');
        }
        const latestUserMessage = [...input.messages].reverse().find((message) => message.role === 'user');
        if (!latestUserMessage) {
            throw new ApiError(400, 'user_message_required', 'At least one user message is required.');
        }
        await this.repository.consumeChatQuota(subject, this.config.chatRateLimitPerMinute);
        const conversationId = input.conversation_id ?? randomUUID();
        if (input.conversation_id) {
            await this.repository.ensureConversationAccess(subject, conversationId);
        }
        const providerMessages = input.messages.map((message) => ({
            role: message.role,
            content: message.content,
        }));
        const chunks = await this.provider.stream(model, providerMessages, signal);
        return {
            conversationId,
            model,
            chunks,
            persist: async (assistantContent) => {
                if (assistantContent.length === 0) {
                    throw new ApiError(502, 'empty_ai_response', 'The AI provider returned no response content.');
                }
                await this.repository.saveTurn({
                    subject,
                    conversationId,
                    model,
                    userContent: latestUserMessage.content,
                    assistantContent,
                });
            },
        };
    }
}
//# sourceMappingURL=service.js.map