import { ApiError } from '../errors.js';
export class OpenAiCompatibleProvider {
    config;
    fetchImplementation;
    constructor(config, fetchImplementation = fetch) {
        this.config = config;
        this.fetchImplementation = fetchImplementation;
    }
    async stream(model, messages, signal) {
        if (!this.config.aiApiKey) {
            throw new ApiError(503, 'ai_provider_not_configured', 'AI provider credentials have not been configured on the server.');
        }
        const endpoint = new URL('chat/completions', `${this.config.aiBaseUrl.replace(/\/+$/, '')}/`);
        let response;
        try {
            response = await this.fetchImplementation(endpoint, {
                method: 'POST',
                headers: {
                    authorization: `Bearer ${this.config.aiApiKey}`,
                    accept: 'text/event-stream',
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    model,
                    stream: true,
                    max_tokens: 4096,
                    messages,
                }),
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
        if (!response.ok) {
            await response.body?.cancel();
            if (response.status === 429) {
                throw new ApiError(503, 'ai_provider_busy', 'The AI provider is temporarily busy.');
            }
            throw new ApiError(502, 'ai_provider_error', 'The AI provider rejected the request.');
        }
        if (!response.headers.get('content-type')?.toLowerCase().startsWith('text/event-stream')) {
            await response.body?.cancel();
            throw new ApiError(502, 'invalid_ai_stream', 'The AI provider returned an unsupported response.');
        }
        if (!response.body) {
            throw new ApiError(502, 'empty_ai_stream', 'The AI provider returned an empty response.');
        }
        return parseProviderStream(response.body, this.config.chatMaxResponseBytes);
    }
}
async function* parseProviderStream(body, maximumBytes) {
    const reader = body.getReader();
    const decoder = new TextDecoder();
    let pending = '';
    let eventData = [];
    let totalBytes = 0;
    let receivedDone = false;
    const emit = (line) => {
        if (line === '') {
            if (eventData.length === 0)
                return undefined;
            const data = eventData.join('\n');
            eventData = [];
            if (data === '[DONE]') {
                receivedDone = true;
                return { content: '', finished: true };
            }
            let parsed;
            try {
                parsed = JSON.parse(data);
            }
            catch {
                throw new ApiError(502, 'invalid_ai_stream', 'The AI provider returned an invalid stream event.');
            }
            if (!isRecord(parsed) || 'error' in parsed) {
                throw new ApiError(502, 'ai_provider_error', 'The AI provider reported a stream error.');
            }
            const choices = parsed.choices;
            if (!Array.isArray(choices) || choices.length === 0)
                return undefined;
            const choice = choices[0];
            if (!isRecord(choice))
                return undefined;
            const delta = choice.delta;
            if (!isRecord(delta))
                return undefined;
            const content = delta.content;
            if (content !== undefined && typeof content !== 'string') {
                throw new ApiError(502, 'invalid_ai_stream', 'The AI provider returned invalid content.');
            }
            return {
                content: content ?? '',
                finished: choice.finish_reason !== null && choice.finish_reason !== undefined,
            };
        }
        if (line.startsWith(':'))
            return undefined;
        if (line.startsWith('data:'))
            eventData.push(line.slice(5).replace(/^ /, ''));
        return undefined;
    };
    try {
        while (true) {
            const { value, done } = await reader.read();
            if (done)
                break;
            totalBytes += value.byteLength;
            if (totalBytes > maximumBytes) {
                throw new ApiError(502, 'ai_response_too_large', 'The AI response exceeded the configured size limit.');
            }
            pending += decoder.decode(value, { stream: true });
            let newline = pending.indexOf('\n');
            while (newline >= 0) {
                const line = pending.slice(0, newline).replace(/\r$/, '');
                pending = pending.slice(newline + 1);
                const chunk = emit(line);
                if (chunk) {
                    yield chunk;
                    if (chunk.finished && receivedDone)
                        return;
                }
                newline = pending.indexOf('\n');
            }
        }
        pending += decoder.decode();
        if (pending.length > 0) {
            const chunk = emit(pending.replace(/\r$/, ''));
            if (chunk)
                yield chunk;
        }
        const finalChunk = emit('');
        if (finalChunk)
            yield finalChunk;
        if (!receivedDone) {
            throw new ApiError(502, 'incomplete_ai_stream', 'The AI provider ended the response unexpectedly.');
        }
    }
    finally {
        if (receivedDone)
            await reader.cancel().catch(() => { });
        reader.releaseLock();
    }
}
function isRecord(value) {
    return typeof value === 'object' && value !== null;
}
//# sourceMappingURL=openai-compatible-provider.js.map