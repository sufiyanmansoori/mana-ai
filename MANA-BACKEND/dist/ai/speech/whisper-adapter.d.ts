import type { SpeechRecognitionProvider } from './stt-service.js';
export interface WhisperOptions {
    apiKey: string;
    baseUrl?: string;
    model?: string;
    timeoutMs?: number;
    fetchImplementation?: typeof fetch;
}
export declare class WhisperAdapter implements SpeechRecognitionProvider {
    private readonly options;
    private readonly baseUrl;
    private readonly fetchImplementation;
    constructor(options: WhisperOptions);
    transcribe(audio: Uint8Array, input: {
        mimeType: string;
        filename: string;
        signal?: AbortSignal;
    }): Promise<string>;
}
