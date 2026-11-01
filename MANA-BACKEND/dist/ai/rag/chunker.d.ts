export interface ChunkingOptions {
    maxCharacters: number;
    overlapCharacters: number;
}
export interface TextChunk {
    index: number;
    text: string;
    start: number;
    end: number;
}
export declare function chunkText(text: string, options: ChunkingOptions): TextChunk[];
