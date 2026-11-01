import type { ParsedEnvironment } from './env-schema.js';
export interface StorageRuntimeConfig {
    provider: ParsedEnvironment['STORAGE_PROVIDER'];
    localDirectory: string;
    maxUploadBytes: number;
    allowedMimeTypes: string[];
    bucket?: string;
}
export declare function createStorageRuntimeConfig(env: ParsedEnvironment): StorageRuntimeConfig;
