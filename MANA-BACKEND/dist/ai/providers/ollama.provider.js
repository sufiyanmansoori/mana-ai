import { ApiError } from '../../errors.js';
export class OllamaProvider {
    config;
    fetchImplementation;
    constructor(config, fetchImplementation = fetch) {
        this.config = config;
        this.fetchImplementation = fetchImplementation;
    }
    async stream(model, messages, signal) {
        const endpoint = new URL('/api/chat', this.config.aiBaseUrl);
        let response;
        try {
            response = await this.fetchImplementation(endpoint, {
                method: 'POST',
                headers: {
                    ...(this.config.aiApiKey ? { authorization: `Bearer ${this.config.aiApiKey}` } : {}),
                    accept: 'application/x-ndjson',
                    'content-type': 'application/json',
                },
                body: JSON.stringify({ model, messages, stream: true }),
                signal: AbortSignal.any([signal, AbortSignal.timeout(this.config.aiTimeoutMs)]),
            });
        }
        catch (error) {
            if (signal.aborted)
                throw error;
            if (error instanceof Error && error.name === 'TimeoutError') {
                throw new ApiError(504, 'ai_provider_timeout', 'The AI provider did not respond in time.');
            }
            throw new ApiError(502, 'ai_provider_unavailable', 'The AI provider could not be reached.');
        }
        if (!response.ok || !response.body) {
            await response.body?.cancel();
            throw new ApiError(502, 'ai_provider_error', 'The AI provider rejected the request.');
        }
        const contentType = response.headers.get('content-type')?.toLowerCase() ?? '';
        if (!contentType.includes('application/x-ndjson') && !contentType.includes('application/json')) {
            await response.body.cancel();
            throw new ApiError(502, 'invalid_ai_stream', 'The AI provider returned an unsupported response.');
        }
        return parseOllamaStream(response.body, this.config.chatMaxResponseBytes);
    }
}
async function* parseOllamaStream(body, maximumBytes) {
    const reader = body.getReader();
    const decoder = new TextDecoder();
    let pending = '';
    let byteCount = 0;
    let finished = false;
    const parseLine = (line) => {
        if (line.trim().length === 0)
            return undefined;
        let payload;
        try {
            payload = JSON.parse(line);
        }
        catch {
            throw new ApiError(502, 'invalid_ai_stream', 'The AI provider returned invalid JSON.');
        }
        if (!isRecord(payload) || 'error' in payload) {
            throw new ApiError(502, 'ai_provider_error', 'The AI provider reported a stream error.');
        }
        const message = payload.message;
        const content = isRecord(message) ? message.content : undefined;
        if (content !== undefined && typeof content !== 'string') {
            throw new ApiError(502, 'invalid_ai_stream', 'The AI provider returned invalid content.');
        }
        const done = payload.done === true;
        finished ||= done;
        return { content: content ?? '', finished: done };
    };
    try {
        while (true) {
            const { value, done } = await reader.read();
            if (done)
                break;
            byteCount += value.byteLength;
            if (byteCount > maximumBytes) {
                throw new ApiError(502, 'ai_response_too_large', 'The AI response exceeded the configured size limit.');
            }
            pending += decoder.decode(value, { stream: true });
            let newline = pending.indexOf('\n');
            while (newline >= 0) {
                const line = pending.slice(0, newline).trimEnd();
                pending = pending.slice(newline + 1);
                const chunk = parseLine(line);
                if (chunk) {
                    yield chunk;
                    if (chunk.finished)
                        return;
                }
                newline = pending.indexOf('\n');
            }
        }
        pending += decoder.decode();
        const finalChunk = parseLine(pending);
        if (finalChunk) {
            yield finalChunk;
            finished ||= finalChunk.finished;
        }
        if (!finished) {
            throw new ApiError(502, 'incomplete_ai_stream', 'The AI provider ended the response unexpectedly.');
        }
    }
    finally {
        await reader.cancel().catch(() => { });
        reader.releaseLock();
    }
}
function isRecord(value) {
    return typeof value === 'object' && value !== null;
}
//# sourceMappingURL=ollama.provider.js.map