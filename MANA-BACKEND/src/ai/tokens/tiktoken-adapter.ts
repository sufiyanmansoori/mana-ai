import type { TokenCounter } from './token-counter.js';

export interface TiktokenEncoding {
  encode(text: string): readonly number[];
}

export function createTiktokenCounter(encoding: TiktokenEncoding): TokenCounter {
  return {
    count(text) {
      return encoding.encode(text).length;
    },
  };
}
