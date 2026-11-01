import type { Writable } from 'node:stream';
export declare function writeWithBackpressure(writable: Writable, chunk: string | Uint8Array, signal?: AbortSignal): Promise<void>;
