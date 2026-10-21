import { randomUUID } from 'node:crypto';
import type { AppConfig } from '../config.js';
import { ApiError } from '../errors.js';
import {
  OpenAiCompatibleProvider,
  type ProviderChunk,
  type ProviderMessage,
} from './openai-compatible-provider.js';
import { ChatRepository } from './repository.js';
import type { ChatRequest } from './schemas.js';

export interface PreparedCompletion {
  conversationId: string;
  model: string;
  chunks: AsyncGenerator<ProviderChunk>;
  persist: (assistantContent: string) => Promise<void>;
}

export class ChatService {
  constructor(
    private readonly config: AppConfig,
    private readonly repository: ChatRepository,
    private readonly provider: OpenAiCompatibleProvider,
  ) {}

  async prepare(subject: string, input: ChatRequest, signal: AbortSignal): Promise<PreparedCompletion> {
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

    const providerMessages: ProviderMessage[] = input.messages.map((message) => ({
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
