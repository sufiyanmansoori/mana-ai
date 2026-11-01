import { ApiError } from '../errors.js';
import type { AppConfig } from '../config.js';
import {
  BaseAiProvider,
  type ProviderChunk,
  type ProviderMessage,
} from '../ai/providers/base-provider.provider.js';

export type { ProviderChunk, ProviderMessage } from '../ai/providers/base-provider.provider.js';

export class OpenAiCompatibleProvider extends BaseAiProvider {
  constructor(
    config: AppConfig,
    fetchImplementation: typeof fetch = fetch,
  ) {
    super(config, fetchImplementation);
  }

  async stream(
    model: string,
    messages: ProviderMessage[],
    signal: AbortSignal,
  ): Promise<AsyncGenerator<ProviderChunk>> {
    const endpoint = new URL('chat/completions', `${this.config.aiBaseUrl.replace(/\/+$/, '')}/`);
    const body = await this.post(endpoint, {
      authorization: `Bearer ${this.config.aiApiKey ?? ''}`,
    }, {
      model,
      stream: true,
      max_tokens: 4096,
      messages,
    }, signal);
    return parseOpenAiCompatibleStream(body, this.config.chatMaxResponseBytes);
  }
}

export async function* parseOpenAiCompatibleStream(
  body: ReadableStream<Uint8Array>,
  maximumBytes: number,
): AsyncGenerator<ProviderChunk> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let pending = '';
  let eventData: string[] = [];
  let totalBytes = 0;
  let receivedDone = false;

  const emit = (line: string): ProviderChunk | undefined => {
    if (line === '') {
      if (eventData.length === 0) return undefined;
      const data = eventData.join('\n');
      eventData = [];
      if (data === '[DONE]') {
        receivedDone = true;
        return { content: '', finished: true };
      }
      let parsed: unknown;
      try {
        parsed = JSON.parse(data);
      } catch {
        throw new ApiError(502, 'invalid_ai_stream', 'The AI provider returned an invalid stream event.');
      }
      if (!isRecord(parsed) || 'error' in parsed) {
        throw new ApiError(502, 'ai_provider_error', 'The AI provider reported a stream error.');
      }
      const choices = parsed.choices;
      if (!Array.isArray(choices) || choices.length === 0) return undefined;
      const choice = choices[0];
      if (!isRecord(choice)) return undefined;
      const delta = choice.delta;
      if (!isRecord(delta)) return undefined;
      const content = delta.content;
      if (content !== undefined && typeof content !== 'string') {
        throw new ApiError(502, 'invalid_ai_stream', 'The AI provider returned invalid content.');
      }
      return {
        content: content ?? '',
        finished: choice.finish_reason !== null && choice.finish_reason !== undefined,
      };
    }
    if (line.startsWith(':')) return undefined;
    if (line.startsWith('data:')) eventData.push(line.slice(5).replace(/^ /, ''));
    return undefined;
  };

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > maximumBytes) {
        throw new ApiError(502, 'ai_response_too_large', 'The AI response exceeded the configured size limit.');
      }
      pending += decoder.decode(value, { stream: true });
      let newline = pending.indexOf('\n');
      while (newline >= 0) {
        const line = pending.slice(0, newline).replace(/\r$/, '');
        pending = pending.slice(newline + 1);
        const chunk = emit(line);
        if (chunk) {
          yield chunk;
          if (chunk.finished && receivedDone) return;
        }
        newline = pending.indexOf('\n');
      }
    }
    pending += decoder.decode();
    if (pending.length > 0) {
      const chunk = emit(pending.replace(/\r$/, ''));
      if (chunk) yield chunk;
    }
    const finalChunk = emit('');
    if (finalChunk) yield finalChunk;
    if (!receivedDone) {
      throw new ApiError(502, 'incomplete_ai_stream', 'The AI provider ended the response unexpectedly.');
    }
  } finally {
    if (receivedDone) await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
