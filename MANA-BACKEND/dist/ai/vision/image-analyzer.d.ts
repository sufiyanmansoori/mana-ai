import type { PreparedImage } from './image-preprocessor.js';
export interface ImageAnalysisProvider {
    analyze(image: PreparedImage, prompt: string, signal?: AbortSignal): Promise<string>;
}
export declare function analyzeImage(image: PreparedImage, prompt: string, provider: ImageAnalysisProvider, signal?: AbortSignal): Promise<string>;
