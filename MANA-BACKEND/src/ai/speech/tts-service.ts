export interface SpeechSynthesisProvider {
  synthesize(
    text: string,
    input: { voiceId: string; format?: string; signal?: AbortSignal },
  ): Promise<Uint8Array>;
}

export async function synthesizeSpeech(
  text: string,
  input: { voiceId: string; format?: string; signal?: AbortSignal },
  provider: SpeechSynthesisProvider,
  maximumCharacters = 5000,
): Promise<Uint8Array> {
  const normalized = text.trim();
  if (normalized.length === 0 || normalized.length > maximumCharacters) {
    throw new RangeError('Speech text must be non-empty and within the configured limit.');
  }
  if (input.voiceId.trim().length === 0) throw new TypeError('A voice ID is required.');
  const audio = await provider.synthesize(normalized, input);
  if (audio.byteLength === 0) throw new Error('Speech synthesis returned an empty audio response.');
  return audio;
}
