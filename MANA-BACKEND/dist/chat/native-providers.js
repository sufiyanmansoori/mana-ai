import { ApiError } from '../errors.js';
import { BaseAiProvider, } from '../ai/providers/base-provider.provider.js';
class NativeProvider extends BaseAiProvider {
}
export class AnthropicProvider extends NativeProvider {
    async stream(model, messages, signal) {
        const endpoint = providerEndpoint(this.config.aiBaseUrl, 'messages');
        const system = messages.filter((message) => message.role === 'system')
            .map((message) => message.content).join('\n\n');
        const requestMessages = messages.filter((message) => message.role !== 'system')
            .map((message) => ({
            role: message.role === 'assistant' ? 'assistant' : 'user',
            content: message.content,
        }));
        const body = {
            model,
            max_tokens: 4096,
            stream: true,
            messages: requestMessages,
        };
        if (system)
            body.system = system;
        const response = await this.post(endpoint, {
            'x-api-key': this.config.aiApiKey ?? '',
            'anthropic-version': '2023-06-01',
        }, body, signal);
        return parseNativeStream(response, this.config.chatMaxResponseBytes, parseAnthropicEvent);
    }
}
export class GeminiProvider extends NativeProvider {
    async stream(model, messages, signal) {
        const endpoint = providerEndpoint(this.config.aiBaseUrl, `models/${encodeURIComponent(model)}:streamGenerateContent`);
        endpoint.searchParams.set('alt', 'sse');
        const system = messages.filter((message) => message.role === 'system')
            .map((message) => message.content).join('\n\n');
        const contents = messages.filter((message) => message.role !== 'system')
            .map((message) => ({
            role: message.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: message.content }],
        }));
        const body = {
            contents,
            generationConfig: { maxOutputTokens: 4096 },
        };
        if (system)
            body.systemInstruction = { parts: [{ text: system }] };
        const response = await this.post(endpoint, {
            'x-goog-api-key': this.config.aiApiKey ?? '',
        }, body, signal);
        return parseNativeStream(response, this.config.chatMaxResponseBytes, parseGeminiEvent);
    }
}
function providerEndpoint(baseUrl, path) {
    return new URL(path, `${baseUrl.replace(/\/+$/, '')}/`);
}
async function* parseNativeStream(body, maximumBytes, parseEvent) {
    const reader = body.getReader();
    const decoder = new TextDecoder();
    let pending = '';
    let eventName = '';
    let eventData = [];
    let totalBytes = 0;
    let receivedFinalEvent = false;
    const consumeLine = (line) => {
        if (line === '') {
            if (eventData.length === 0) {
                eventName = '';
                return undefined;
            }
            const event = { event: eventName, data: eventData.join('\n') };
            eventName = '';
            eventData = [];
            return event;
        }
        if (line.startsWith(':'))
            return undefined;
        const separator = line.indexOf(':');
        const field = separator < 0 ? line : line.slice(0, separator);
        const value = separator < 0 ? '' : line.slice(separator + 1).replace(/^ /, '');
        if (field === 'event')
            eventName = value;
        if (field === 'data')
            eventData.push(value);
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
                const event = consumeLine(line);
                if (event) {
                    const chunk = parseEvent(event);
                    if (chunk) {
                        if (chunk.finished)
                            receivedFinalEvent = true;
                        yield chunk;
                        if (receivedFinalEvent)
                            return;
                    }
                }
                newline = pending.indexOf('\n');
            }
        }
        pending += decoder.decode();
        if (pending.length > 0) {
            const event = consumeLine(pending.replace(/\r$/, ''));
            if (event) {
                const chunk = parseEvent(event);
                if (chunk) {
                    if (chunk.finished)
                        receivedFinalEvent = true;
                    yield chunk;
                }
            }
        }
        const finalEvent = consumeLine('');
        if (finalEvent) {
            const chunk = parseEvent(finalEvent);
            if (chunk) {
                if (chunk.finished)
                    receivedFinalEvent = true;
                yield chunk;
            }
        }
        if (!receivedFinalEvent) {
            throw new ApiError(502, 'incomplete_ai_stream', 'The AI provider ended the response unexpectedly.');
        }
    }
    finally {
        await reader.cancel().catch(() => { });
        reader.releaseLock();
    }
}
function parseAnthropicEvent(event) {
    if (event.event === 'message_stop')
        return { content: '', finished: true };
    const parsed = parseJsonEvent(event.data);
    if (event.event === 'error' || 'error' in parsed) {
        throw new ApiError(502, 'ai_provider_error', 'The AI provider reported a stream error.');
    }
    if (event.event !== 'content_block_delta')
        return undefined;
    const delta = parsed.delta;
    if (!isRecord(delta))
        return undefined;
    const text = delta.text;
    if (text !== undefined && typeof text !== 'string') {
        throw new ApiError(502, 'invalid_ai_stream', 'The AI provider returned invalid content.');
    }
    return { content: text ?? '', finished: false };
}
function parseGeminiEvent(event) {
    const parsed = parseJsonEvent(event.data);
    if ('error' in parsed) {
        throw new ApiError(502, 'ai_provider_error', 'The AI provider reported a stream error.');
    }
    const candidates = parsed.candidates;
    if (!Array.isArray(candidates) || candidates.length === 0)
        return undefined;
    const candidate = candidates[0];
    if (!isRecord(candidate))
        return undefined;
    const finishReason = candidate.finishReason;
    const content = candidate.content;
    let text = '';
    if (isRecord(content) && Array.isArray(content.parts)) {
        for (const part of content.parts) {
            if (!isRecord(part))
                continue;
            if (part.text !== undefined && typeof part.text !== 'string') {
                throw new ApiError(502, 'invalid_ai_stream', 'The AI provider returned invalid content.');
            }
            if (typeof part.text === 'string')
                text += part.text;
        }
    }
    return {
        content: text,
        finished: typeof finishReason === 'string' && finishReason.length > 0,
    };
}
function parseJsonEvent(data) {
    let parsed;
    try {
        parsed = JSON.parse(data);
    }
    catch {
        throw new ApiError(502, 'invalid_ai_stream', 'The AI provider returned an invalid stream event.');
    }
    if (!isRecord(parsed)) {
        throw new ApiError(502, 'invalid_ai_stream', 'The AI provider returned an invalid stream event.');
    }
    return parsed;
}
function isRecord(value) {
    return typeof value === 'object' && value !== null;
}
//# sourceMappingURL=native-providers.js.map