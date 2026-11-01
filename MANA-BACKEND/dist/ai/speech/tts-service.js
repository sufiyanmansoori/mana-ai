export async function synthesizeSpeech(text, input, provider, maximumCharacters = 5000) {
    const normalized = text.trim();
    if (normalized.length === 0 || normalized.length > maximumCharacters) {
        throw new RangeError('Speech text must be non-empty and within the configured limit.');
    }
    if (input.voiceId.trim().length === 0)
        throw new TypeError('A voice ID is required.');
    const audio = await provider.synthesize(normalized, input);
    if (audio.byteLength === 0)
        throw new Error('Speech synthesis returned an empty audio response.');
    return audio;
}
//# sourceMappingURL=tts-service.js.map