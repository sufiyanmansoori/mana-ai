import { ApiError } from '../../errors.js';
import type { SpeechSynthesisProvider } from './tts-service.js';

export interface ElevenLabsOptions {
  apiKey: string;
  baseUrl?: string;
  modelId?: string;
  timeoutMs?: number;
  fetchImplementation?: typeof fetch;
}

export class ElevenLabsAdapter implements SpeechSynthesisProvider {
  private readonly baseUrl: string;
  private readonly fetchImplementation: typeof fetch;

  constructor(private readonly options: ElevenLabsOptions) {
    this.baseUrl = options.baseUrl ?? 'https://api.elevenlabs.io/v1';
    this.fetchImplementation = options.fetchImplementation ?? fetch;
    const endpoint = new URL(this.baseUrl);
    if (endpoint.protocol !== 'https:' && !['localhost', '127.0.0.1'].includes(endpoint.hostname)) {
      throw new TypeError('Speech provider endpoint must use HTTPS.');
    }
  }

  async synthesize(
    text: string,
    input: { voiceId: string; format?: string; signal?: AbortSignal },
  ): Promise<Uint8Array> {
    if (!this.options.apiKey) {
      throw new ApiError(503, 'speech_provider_not_configured', 'Speech synthesis is not configured.');
    }
    const endpoint = new URL(
      `text-to-speech/${encodeURIComponent(input.voiceId)}`,
      `${this.baseUrl.replace(/\/+$/, '')}/`,
    );
    if (input.format) endpoint.searchParams.set('output_format', input.format);

    let response: Response;
    try {
      response = await this.fetchImplementation(endpoint, {
        method: 'POST',
        headers: {
          'xi-api-key': this.options.apiKey,
          'content-type': 'application/json',
          accept: 'audio/mpeg',
        },
        body: JSON.stringify({
          text,
          model_id: this.options.modelId ?? 'eleven_multilingual_v2',
        }),
        signal: AbortSignal.any([
          input.signal ?? new AbortController().signal,
          AbortSignal.timeout(this.options.timeoutMs ?? 60_000),
        ]),
      });
    } catch (error) {
      if (input.signal?.aborted) throw error;
      if (error instanceof Error && error.name === 'TimeoutError') {
        throw new ApiError(504, 'speech_provider_timeout', 'Speech synthesis timed out.');
      }
      throw new ApiError(502, 'speech_provider_unavailable', 'Speech synthesis provider is unavailable.');
    }
    if (!response.ok) {
      await response.body?.cancel();
      throw new ApiError(502, 'speech_provider_error', 'Speech synthesis provider rejected the request.');
    }
    return new Uint8Array(await response.arrayBuffer());
  }
}
