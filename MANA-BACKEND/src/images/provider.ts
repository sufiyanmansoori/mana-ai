export interface GeneratedImage {
  base64: string;
  mimeType: 'image/png' | 'image/jpeg' | 'image/webp';
  revisedPrompt?: string;
}

export interface ImageGenerationProvider {
  generate(input: {
    prompt: string;
    size: '1024x1024' | '1536x1024' | '1024x1536';
  }): Promise<GeneratedImage>;
}
