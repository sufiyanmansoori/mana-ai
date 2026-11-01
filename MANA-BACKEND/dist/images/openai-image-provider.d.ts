import type { AppConfig } from '../config.js';
import type { GeneratedImage, ImageGenerationProvider } from './provider.js';
export declare class OpenAiImageGenerationProvider implements ImageGenerationProvider {
    private readonly config;
    private readonly fetchImplementation;
    constructor(config: AppConfig, fetchImplementation?: typeof fetch);
    generate(input: {
        prompt: string;
        size: '1024x1024' | '1536x1024' | '1024x1536';
    }): Promise<GeneratedImage>;
}
