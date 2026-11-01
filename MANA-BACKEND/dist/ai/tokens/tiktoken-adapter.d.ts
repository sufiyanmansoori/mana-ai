import type { TokenCounter } from './token-counter.js';
export interface TiktokenEncoding {
    encode(text: string): readonly number[];
}
export declare function createTiktokenCounter(encoding: TiktokenEncoding): TokenCounter;
