import type { AppConfig } from '../../config.js';
import { ApiError } from '../../errors.js';

export interface ProviderMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ProviderChunk {
  content: string;
  finished: boolean;
}

export interface AiCompletionProvider {
  stream(
    model: string,
    messages: ProviderMessage[],
    signal: AbortSignal,
  ): Promise<AsyncGenerator<ProviderChunk>>;
}

export abstract class BaseAiProvider implements AiCompletionProvider {
  constructor(
    protected readonly config: AppConfig,
    private readonly fetchImplementation: typeof fetch = fetch,
  ) {}

  abstract stream(
    model: string,
    messages: ProviderMessage[],
    signal: AbortSignal,
  ): Promise<AsyncGenerator<ProviderChunk>>;

  protected async post(
    endpoint: URL,
    headers: Record<string, string>,
    body: unknown,
    signal: AbortSignal,
  ): Promise<ReadableStream<Uint8Array>> {
    if (!this.config.aiApiKey) {
      throw new ApiError(
        503,
        'ai_provider_not_configured',
        'AI provider credentials have not been configured on the server.',
      );
    }

    let response: Response;
    try {
      response = await this.fetchImplementation(endpoint, {
        method: 'POST',
        headers: {
          ...headers,
          accept: 'text/event-stream',
          'content-type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: AbortSignal.any([signal, AbortSignal.timeout(this.config.aiTimeoutMs)]),
      });
    } catch (error) {
      if (signal.aborted) throw error;
      if (error instanceof Error && error.name === 'TimeoutError') {
        throw new ApiError(504, 'ai_provider_timeout', 'The AI provider did not respond in time.');
      }
      throw new ApiError(502, 'ai_provider_unavailable', 'The AI provider could not be reached.');
    }

    if (!response.ok) {
      await response.body?.cancel();
      if (response.status === 429) {
        throw new ApiError(503, 'ai_provider_busy', 'The AI provider is temporarily busy.');
      }
      throw new ApiError(502, 'ai_provider_error', 'The AI provider rejected the request.');
    }
    if (!response.headers.get('content-type')?.toLowerCase().startsWith('text/event-stream')) {
      await response.body?.cancel();
      throw new ApiError(502, 'invalid_ai_stream', 'The AI provider returned an unsupported response.');
    }
    if (!response.body) {
      throw new ApiError(502, 'empty_ai_stream', 'The AI provider returned an empty response.');
    }
    return response.body;
  }
}