import type { ParsedEnvironment } from './env-schema.js';

export interface StorageRuntimeConfig {
  provider: ParsedEnvironment['STORAGE_PROVIDER'];
  localDirectory: string;
  maxUploadBytes: number;
  allowedMimeTypes: string[];
  bucket?: string;
}

export function createStorageRuntimeConfig(env: ParsedEnvironment): StorageRuntimeConfig {
  if (env.STORAGE_PROVIDER !== 'local' && !env.STORAGE_BUCKET) {
    throw new Error('STORAGE_BUCKET is required for remote object storage.');
  }
  const allowedMimeTypes = [...new Set(env.STORAGE_ALLOWED_MIME_TYPES
    .split(',')
    .map((mimeType) => mimeType.trim().toLowerCase())
    .filter(Boolean))];
  if (allowedMimeTypes.length === 0 || allowedMimeTypes.some((mimeType) => !/^[\w.+-]+\/[\w.+*-]+$/u.test(mimeType))) {
    throw new Error('STORAGE_ALLOWED_MIME_TYPES must contain valid MIME types.');
  }
  return {
    provider: env.STORAGE_PROVIDER,
    localDirectory: env.STORAGE_LOCAL_DIRECTORY,
    maxUploadBytes: env.STORAGE_MAX_UPLOAD_BYTES,
    allowedMimeTypes,
    ...(env.STORAGE_BUCKET ? { bucket: env.STORAGE_BUCKET } : {}),
  };
}
