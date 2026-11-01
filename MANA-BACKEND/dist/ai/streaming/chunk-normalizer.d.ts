import type { ProviderChunk } from '../providers/base-provider.provider.js';
export interface NormalizedChunk {
    sequence: number;
    content: string;
    finished: boolean;
}
export declare function normalizeChunks(source: AsyncIterable<ProviderChunk>, options: {
    maxCharacters: number;
}): AsyncGenerator<NormalizedChunk>;
