export interface SpeechSynthesisProvider {
    synthesize(text: string, input: {
        voiceId: string;
        format?: string;
        signal?: AbortSignal;
    }): Promise<Uint8Array>;
}
export declare function synthesizeSpeech(text: string, input: {
    voiceId: string;
    format?: string;
    signal?: AbortSignal;
}, provider: SpeechSynthesisProvider, maximumCharacters?: number): Promise<Uint8Array>;
