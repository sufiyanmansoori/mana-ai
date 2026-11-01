import { REGEX } from './regex.js';

export const DEFAULT_CHAT_MODEL_ID = 'gpt-4o-mini';
export const DEFAULT_IMAGE_MODEL_ID = 'gpt-image-1';
export const DEFAULT_TRANSCRIPTION_MODEL_ID = 'whisper-1';
export const DEFAULT_SPEECH_MODEL_ID = 'eleven_multilingual_v2';

export const MODEL_ID_PATTERN = REGEX.modelId;

export function parseModelAllowlist(
  value: string | undefined,
  defaultModel: string,
): string[] {
  const models = value === undefined
    ? [defaultModel]
    : value.split(',').map((model) => model.trim()).filter(Boolean);
  if (
    models.length === 0 ||
    models.some((model) => !MODEL_ID_PATTERN.test(model)) ||
    new Set(models).size !== models.length
  ) {
    throw new Error('AI_ALLOWED_MODELS must contain unique, valid model IDs.');
  }
  if (!models.includes(defaultModel)) {
    throw new Error('AI_MODEL must be present in AI_ALLOWED_MODELS.');
  }
  return models;
}
