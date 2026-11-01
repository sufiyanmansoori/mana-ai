import { ApiError } from '../../errors.js';
import { BaseAiProvider, } from './base-provider.provider.js';
export class CohereProvider extends BaseAiProvider {
    async stream(model, messages, signal) {
        const endpoint = new URL('/v2/chat', this.config.aiBaseUrl);
        const response = await this.post(endpoint, {
            authorization: `Bearer ${this.config.aiApiKey ?? ''}`,
        }, {
            model,
            messages: messages.map(({ role, content }) => ({ role, content })),
            stream: true,
        }, signal);
        return parseCohereStream(response, this.config.chatMaxResponseBytes);
    }
}
async function* parseCohereStream(body, maximumBytes) {
    const reader = body.getReader();
    const decoder = new TextDecoder();
    let pending = '';
    let event = '';
    let data = [];
    let byteCount = 0;
    let finished = false;
    const dispatch = () => {
        if (data.length === 0) {
            event = '';
            return undefined;
        }
        const payload = JSON.parse(data.join('\n'));
        const currentEvent = event;
        event = '';
        data = [];
        if (!isRecord(payload)) {
            throw new ApiError(502, 'invalid_ai_stream', 'The AI provider returned an invalid stream event.');
        }
        if (currentEvent === 'error' || 'error' in payload) {
            throw new ApiError(502, 'ai_provider_error', 'The AI provider reported a stream error.');
        }
        if (payload.type === 'message-end' || currentEvent === 'message-end') {
            finished = true;
            return { content: '', finished: true };
        }
        if (payload.type !== 'content-delta')
            return undefined;
        const delta = payload.delta;
        if (!isRecord(delta) || !isRecord(delta.message) || !isRecord(delta.message.content)) {
            return undefined;
        }
        const text = delta.message.content.text;
        if (typeof text !== 'string') {
            throw new ApiError(502, 'invalid_ai_stream', 'The AI provider returned invalid text content.');
        }
        return { content: text, finished: false };
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
                const line = pending.slice(0, newline).replace(/\r$/u, '');
                pending = pending.slice(newline + 1);
                if (line === '') {
                    const chunk = dispatch();
                    if (chunk) {
                        yield chunk;
                        if (chunk.finished)
                            return;
                    }
                }
                else if (line.startsWith('event:')) {
                    event = line.slice(6).trim();
                }
                else if (line.startsWith('data:')) {
                    data.push(line.slice(5).replace(/^ /u, ''));
                }
                newline = pending.indexOf('\n');
            }
        }
        pending += decoder.decode();
        if (pending.length > 0) {
            if (pending.startsWith('data:'))
                data.push(pending.slice(5).replace(/^ /u, ''));
        }
        const finalChunk = dispatch();
        if (finalChunk) {
            yield finalChunk;
            finished ||= finalChunk.finished;
        }
        if (!finished) {
            throw new ApiError(502, 'incomplete_ai_stream', 'The AI provider ended the response unexpectedly.');
        }
    }
    catch (error) {
        if (error instanceof ApiError)
            throw error;
        throw new ApiError(502, 'invalid_ai_stream', 'The AI provider returned an invalid stream event.');
    }
    finally {
        await reader.cancel().catch(() => { });
        reader.releaseLock();
    }
}
function isRecord(value) {
    return typeof value === 'object' && value !== null;
}
//# sourceMappingURL=cohere.provider.js.map