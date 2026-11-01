import type { SpeechSynthesisProvider } from './tts-service.js';
export interface ElevenLabsOptions {
    apiKey: string;
    baseUrl?: string;
    modelId?: string;
    timeoutMs?: number;
    fetchImplementation?: typeof fetch;
}
export declare class ElevenLabsAdapter implements SpeechSynthesisProvider {
    private readonly options;
    private readonly baseUrl;
    private readonly fetchImplementation;
    constructor(options: ElevenLabsOptions);
    synthesize(text: string, input: {
        voiceId: string;
        format?: string;
        signal?: AbortSignal;
    }): Promise<Uint8Array>;
}
