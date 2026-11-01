export declare const DEFAULT_CHAT_MODEL_ID = "gpt-4o-mini";
export declare const DEFAULT_IMAGE_MODEL_ID = "gpt-image-1";
export declare const DEFAULT_TRANSCRIPTION_MODEL_ID = "whisper-1";
export declare const DEFAULT_SPEECH_MODEL_ID = "eleven_multilingual_v2";
export declare const MODEL_ID_PATTERN: RegExp;
export declare function parseModelAllowlist(value: string | undefined, defaultModel: string): string[];
