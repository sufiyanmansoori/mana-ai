export type SupportedImageType = 'image/png' | 'image/jpeg' | 'image/webp';
export interface PreparedImage {
    mimeType: SupportedImageType;
    data: Uint8Array;
}
export declare function prepareImage(data: Uint8Array, mimeType: string, maximumBytes: number): PreparedImage;
