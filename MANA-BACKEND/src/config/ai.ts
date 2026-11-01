import type { ParsedEnvironment } from './env-schema.js';
import { DEFAULT_CHAT_MODEL_ID, parseModelAllowlist } from '../constants/model-ids.js';

const DEFAULT_BASE_URLS: Record<ParsedEnvironment['AI_PROVIDER'], string | undefined> = {
  openai: 'https://api.openai.com/v1',
  'openai-compatible': 'https://api.openai.com/v1',
  anthropic: 'https://api.anthropic.com/v1',
  'azure-openai': undefined,
  cohere: 'https://api.cohere.com',
  gemini: 'https://generativelanguage.googleapis.com/v1beta',
  groq: 'https://api.groq.com/openai/v1',
  mistral: 'https://api.mistral.ai/v1',
  ollama: 'http://localhost:11434',
};

export interface AiRuntimeConfig {
  provider: ParsedEnvironment['AI_PROVIDER'];
  baseUrl: string;
  apiKey?: string;
  apiVersion?: string;
  model: string;
  allowedModels: string[];
  timeoutMs: number;
  maxRetries: number;
  circuitBreakerFailures: number;
  circuitBreakerResetMs: number;
  imageApiKey?: string;
  imageBaseUrl: string;
  imageModel: string;
  imageTimeoutMs: number;
}

export function createAiRuntimeConfig(env: ParsedEnvironment): AiRuntimeConfig {
  if (env.AI_PROVIDER === 'azure-openai' && !env.AI_API_VERSION) {
    throw new Error('AI_API_VERSION must be set when AI_PROVIDER is azure-openai.');
  }
  const baseUrl = env.AI_BASE_URL ?? DEFAULT_BASE_URLS[env.AI_PROVIDER];
  if (!baseUrl) throw new Error(`AI_BASE_URL must be set when AI_PROVIDER is ${env.AI_PROVIDER}.`);
  assertSecureEndpoint(baseUrl, env.NODE_ENV, 'AI_BASE_URL');

  const model = env.AI_MODEL ??
    (env.AI_PROVIDER === 'openai' || env.AI_PROVIDER === 'openai-compatible'
      ? DEFAULT_CHAT_MODEL_ID
      : undefined);
  if (!model) throw new Error(`AI_MODEL must be set when AI_PROVIDER is ${env.AI_PROVIDER}.`);
  const allowedModels = parseModelAllowlist(env.AI_ALLOWED_MODELS, model);

  const imageBaseUrl = env.IMAGE_BASE_URL ?? (
    env.AI_PROVIDER === 'openai' || env.AI_PROVIDER === 'openai-compatible'
      ? baseUrl
      : 'https://api.openai.com/v1'
  );
  assertSecureEndpoint(imageBaseUrl, env.NODE_ENV, 'IMAGE_BASE_URL');
  const imageApiKey = env.IMAGE_API_KEY ??
    (env.AI_PROVIDER === 'openai' || env.AI_PROVIDER === 'openai-compatible'
      ? env.AI_API_KEY
      : undefined);

  return {
    provider: env.AI_PROVIDER,
    baseUrl,
    ...(env.AI_API_KEY ? { apiKey: env.AI_API_KEY } : {}),
    ...(env.AI_API_VERSION ? { apiVersion: env.AI_API_VERSION } : {}),
    model,
    allowedModels,
    timeoutMs: env.AI_TIMEOUT_MS,
    maxRetries: env.AI_MAX_RETRIES,
    circuitBreakerFailures: env.AI_CIRCUIT_BREAKER_FAILURES,
    circuitBreakerResetMs: env.AI_CIRCUIT_BREAKER_RESET_MS,
    ...(imageApiKey ? { imageApiKey } : {}),
    imageBaseUrl,
    imageModel: env.IMAGE_MODEL,
    imageTimeoutMs: env.IMAGE_TIMEOUT_MS,
  };
}

function assertSecureEndpoint(value: string, environment: string, name: string): void {
  const url = new URL(value);
  if (url.username || url.password) {
    throw new Error(`${name} must not contain embedded credentials.`);
  }
  if (
    url.protocol !== 'https:' &&
    !(environment !== 'production' && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname))
  ) {
    throw new Error(`${name} must use HTTPS outside local development.`);
  }
}
