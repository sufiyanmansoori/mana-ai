const SUPPORTED_AUDIO_TYPES = new Set([
    'audio/mpeg',
    'audio/mp4',
    'audio/wav',
    'audio/webm',
    'audio/ogg',
]);
export async function transcribeAudio(audio, input, provider, maximumBytes = 25 * 1024 * 1024) {
    if (audio.byteLength === 0 || audio.byteLength > maximumBytes) {
        throw new RangeError('Audio size must be greater than zero and within the configured limit.');
    }
    if (!SUPPORTED_AUDIO_TYPES.has(input.mimeType)) {
        throw new TypeError('The supplied audio MIME type is not supported.');
    }
    if (/[/\\\0\r\n]/u.test(input.filename) ||
        input.filename.trim().length === 0 ||
        input.filename === '.' ||
        input.filename === '..') {
        throw new TypeError('Audio filename must be a simple non-empty filename.');
    }
    if (!matchesAudioSignature(audio, input.mimeType)) {
        throw new TypeError('Audio contents do not match the declared MIME type.');
    }
    const transcript = (await provider.transcribe(audio, input)).trim();
    if (transcript.length === 0)
        throw new Error('Speech recognition returned an empty transcript.');
    return transcript;
}
function matchesAudioSignature(audio, mimeType) {
    const ascii = (start, end) => String.fromCharCode(...audio.slice(start, end));
    switch (mimeType) {
        case 'audio/mpeg':
            return (ascii(0, 3) === 'ID3' ||
                (audio.length > 1 && audio[0] === 0xff && (audio[1] & 0xe0) === 0xe0));
        case 'audio/mp4':
            return audio.length >= 12 && ascii(4, 8) === 'ftyp';
        case 'audio/wav':
            return audio.length >= 12 && ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WAVE';
        case 'audio/webm':
            return audio.length >= 4 &&
                audio[0] === 0x1a && audio[1] === 0x45 && audio[2] === 0xdf && audio[3] === 0xa3;
        case 'audio/ogg':
            return audio.length >= 4 && ascii(0, 4) === 'OggS';
        default:
            return false;
    }
}
//# sourceMappingURL=stt-service.js.map