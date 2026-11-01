export interface SpeechRecognitionProvider {
    transcribe(audio: Uint8Array, input: {
        mimeType: string;
        filename: string;
        signal?: AbortSignal;
    }): Promise<string>;
}
export declare function transcribeAudio(audio: Uint8Array, input: {
    mimeType: string;
    filename: string;
    signal?: AbortSignal;
}, provider: SpeechRecognitionProvider, maximumBytes?: number): Promise<string>;
