import { ApiError } from '../../errors.js';
import type { SpeechRecognitionProvider } from './stt-service.js';

export interface WhisperOptions {
  apiKey: string;
  baseUrl?: string;
  model?: string;
  timeoutMs?: number;
  fetchImplementation?: typeof fetch;
}

export class WhisperAdapter implements SpeechRecognitionProvider {
  private readonly baseUrl: string;
  private readonly fetchImplementation: typeof fetch;

  constructor(private readonly options: WhisperOptions) {
    this.baseUrl = options.baseUrl ?? 'https://api.openai.com/v1';
    this.fetchImplementation = options.fetchImplementation ?? fetch;
    const endpoint = new URL(this.baseUrl);
    if (endpoint.protocol !== 'https:' && !['localhost', '127.0.0.1'].includes(endpoint.hostname)) {
      throw new TypeError('Speech provider endpoint must use HTTPS.');
    }
  }

  async transcribe(
    audio: Uint8Array,
    input: { mimeType: string; filename: string; signal?: AbortSignal },
  ): Promise<string> {
    if (!this.options.apiKey) {
      throw new ApiError(503, 'speech_provider_not_configured', 'Speech recognition is not configured.');
    }
    const form = new FormData();
    form.set('model', this.options.model ?? 'whisper-1');
    const audioBuffer = new ArrayBuffer(audio.byteLength);
    new Uint8Array(audioBuffer).set(audio);
    form.set('file', new Blob([audioBuffer], { type: input.mimeType }), input.filename);

    let response: Response;
    try {
      response = await this.fetchImplementation(new URL('audio/transcriptions', `${this.baseUrl.replace(/\/+$/, '')}/`), {
        method: 'POST',
        headers: { authorization: `Bearer ${this.options.apiKey}` },
        body: form,
        signal: AbortSignal.any([
          input.signal ?? new AbortController().signal,
          AbortSignal.timeout(this.options.timeoutMs ?? 60_000),
        ]),
      });
    } catch (error) {
      if (input.signal?.aborted) throw error;
      if (error instanceof Error && error.name === 'TimeoutError') {
        throw new ApiError(504, 'speech_provider_timeout', 'Speech recognition timed out.');
      }
      throw new ApiError(502, 'speech_provider_unavailable', 'Speech recognition provider is unavailable.');
    }
    if (!response.ok) {
      await response.body?.cancel();
      throw new ApiError(502, 'speech_provider_error', 'Speech recognition provider rejected the request.');
    }
    const result: unknown = await response.json();
    if (
      typeof result !== 'object' ||
      result === null ||
      !('text' in result) ||
      typeof result.text !== 'string'
    ) {
      throw new ApiError(502, 'invalid_speech_response', 'Speech provider returned an invalid response.');
    }
    return result.text;
  }
}
