import { ApiError } from '../errors.js';
const maximumImageBytes = 12 * 1024 * 1024;
const maximumResponseBytes = 20 * 1024 * 1024;
export class OpenAiImageGenerationProvider {
    config;
    fetchImplementation;
    constructor(config, fetchImplementation = fetch) {
        this.config = config;
        this.fetchImplementation = fetchImplementation;
    }
    async generate(input) {
        const apiKey = this.config.imageApiKey;
        if (!apiKey) {
            throw new ApiError(503, 'image_provider_not_configured', 'Image generation is not configured. Add IMAGE_API_KEY or an OpenAI-compatible AI_API_KEY to the backend environment.');
        }
        const url = new URL('images/generations', `${this.config.imageBaseUrl.replace(/\/+$/, '')}/`);
        let response;
        try {
            response = await this.fetchImplementation(url, {
                method: 'POST',
                headers: {
                    authorization: `Bearer ${apiKey}`,
                    'content-type': 'application/json',
                    accept: 'application/json',
                },
                body: JSON.stringify({
                    model: this.config.imageModel,
                    prompt: input.prompt,
                    size: input.size,
                    n: 1,
                }),
                signal: AbortSignal.timeout(this.config.imageTimeoutMs),
            });
        }
        catch (error) {
            if (error instanceof Error && error.name === 'TimeoutError') {
                throw new ApiError(504, 'image_provider_timeout', 'The image service timed out. Please retry.');
            }
            throw new ApiError(502, 'image_provider_unavailable', 'The image service could not be reached.');
        }
        if (!response.ok) {
            await response.body?.cancel();
            if (response.status === 429) {
                throw new ApiError(429, 'image_provider_rate_limited', 'The image service is rate limited. Please retry shortly.');
            }
            throw new ApiError(502, 'image_provider_request_failed', 'The image service could not complete this request. Check its server-side key, model, and account access.');
        }
        const payload = await readJsonResponse(response);
        const data = payload.data;
        if (!Array.isArray(data) || data.length !== 1 || !isObject(data[0])) {
            throw new ApiError(502, 'invalid_image_provider_response', 'The image service returned an invalid response.');
        }
        const encoded = data[0].b64_json;
        if (typeof encoded !== 'string' ||
            encoded.length === 0 ||
            encoded.length > Math.ceil(maximumImageBytes * 4 / 3) + 8 ||
            !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(encoded)) {
            throw new ApiError(502, 'invalid_image_provider_response', 'The image service returned an unsupported image. Configure a base64-output image model such as gpt-image-1.');
        }
        const imageBytes = Buffer.from(encoded, 'base64');
        if (imageBytes.length === 0 || imageBytes.length > maximumImageBytes) {
            throw new ApiError(502, 'image_response_too_large', 'The generated image exceeded the supported size.');
        }
        const mimeType = detectImageMimeType(imageBytes);
        if (!mimeType) {
            throw new ApiError(502, 'invalid_image_provider_response', 'The image service returned an unsupported image format.');
        }
        return {
            base64: imageBytes.toString('base64'),
            mimeType,
            ...(typeof data[0].revised_prompt === 'string'
                ? { revisedPrompt: data[0].revised_prompt.slice(0, 4000) }
                : {}),
        };
    }
}
async function readJsonResponse(response) {
    const reader = response.body?.getReader();
    if (!reader) {
        throw new ApiError(502, 'invalid_image_provider_response', 'The image service returned an empty response.');
    }
    const chunks = [];
    let byteCount = 0;
    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done)
                break;
            byteCount += value.byteLength;
            if (byteCount > maximumResponseBytes) {
                await reader.cancel();
                throw new ApiError(502, 'image_response_too_large', 'The image service response exceeded the supported size.');
            }
            chunks.push(value);
        }
    }
    finally {
        reader.releaseLock();
    }
    try {
        const parsed = JSON.parse(Buffer.concat(chunks.map((chunk) => Buffer.from(chunk))).toString('utf8'));
        if (isObject(parsed))
            return parsed;
    }
    catch (error) {
        if (error instanceof ApiError)
            throw error;
    }
    throw new ApiError(502, 'invalid_image_provider_response', 'The image service returned invalid JSON.');
}
function isObject(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function detectImageMimeType(bytes) {
    if (bytes.length >= 8 &&
        bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
        return 'image/png';
    }
    if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
        return 'image/jpeg';
    }
    if (bytes.length >= 12 &&
        bytes.toString('ascii', 0, 4) === 'RIFF' &&
        bytes.toString('ascii', 8, 12) === 'WEBP') {
        return 'image/webp';
    }
    return null;
}
//# sourceMappingURL=openai-image-provider.js.map