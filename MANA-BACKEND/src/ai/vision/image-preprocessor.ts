export type SupportedImageType = 'image/png' | 'image/jpeg' | 'image/webp';

export interface PreparedImage {
  mimeType: SupportedImageType;
  data: Uint8Array;
}

const SIGNATURES: Record<SupportedImageType, (data: Uint8Array) => boolean> = {
  'image/png': (data) =>
    data.length >= 33 &&
    data[0] === 0x89 && data[1] === 0x50 && data[2] === 0x4e && data[3] === 0x47 &&
    data[4] === 0x0d && data[5] === 0x0a && data[6] === 0x1a && data[7] === 0x0a &&
    data[8] === 0 && data[9] === 0 && data[10] === 0 && data[11] === 13 &&
    ascii(data.slice(12, 16)) === 'IHDR',
  'image/jpeg': (data) =>
    data.length >= 4 &&
    data[0] === 0xff && data[1] === 0xd8 &&
    data[data.length - 2] === 0xff && data[data.length - 1] === 0xd9,
  'image/webp': (data) =>
    data.length >= 12 &&
    ascii(data.slice(0, 4)) === 'RIFF' &&
    ascii(data.slice(8, 12)) === 'WEBP' &&
    new DataView(data.buffer, data.byteOffset, data.byteLength).getUint32(4, true) === data.length - 8,
};

export function prepareImage(
  data: Uint8Array,
  mimeType: string,
  maximumBytes: number,
): PreparedImage {
  if (!Number.isInteger(maximumBytes) || maximumBytes < 1) {
    throw new RangeError('maximumBytes must be a positive integer.');
  }
  if (data.byteLength === 0 || data.byteLength > maximumBytes) {
    throw new RangeError('Image size must be greater than zero and within the configured limit.');
  }
  if (mimeType !== 'image/png' && mimeType !== 'image/jpeg' && mimeType !== 'image/webp') {
    throw new TypeError('Unsupported image type.');
  }
  const supportedType = mimeType as SupportedImageType;
  if (!SIGNATURES[supportedType](data)) throw new TypeError('Image contents do not match the declared MIME type.');
  return { mimeType: supportedType, data: new Uint8Array(data) };
}

function ascii(data: Uint8Array): string {
  return String.fromCharCode(...data);
}
