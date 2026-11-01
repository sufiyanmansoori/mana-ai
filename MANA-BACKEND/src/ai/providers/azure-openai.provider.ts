import type { AppConfig } from '../../config.js';
import {
  BaseAiProvider,
  type ProviderChunk,
  type ProviderMessage,
} from './base-provider.provider.js';
import { parseOpenAiCompatibleStream } from '../../chat/openai-compatible-provider.js';

export interface AzureOpenAiOptions {
  apiVersion: string;
  fetchImplementation?: typeof fetch;
}

export class AzureOpenAiProvider extends BaseAiProvider {
  private readonly apiVersion: string;

  constructor(config: AppConfig, options: AzureOpenAiOptions) {
    super(config, options.fetchImplementation);
    if (!/^\d{4}-\d{2}-\d{2}(?:-preview)?$/u.test(options.apiVersion)) {
      throw new TypeError('Azure OpenAI API version must use the documented date format.');
    }
    this.apiVersion = options.apiVersion;
  }

  async stream(
    deployment: string,
    messages: ProviderMessage[],
    signal: AbortSignal,
  ): Promise<AsyncGenerator<ProviderChunk>> {
    const endpoint = new URL(
      `openai/deployments/${encodeURIComponent(deployment)}/chat/completions`,
      `${this.config.aiBaseUrl.replace(/\/+$/, '')}/`,
    );
    endpoint.searchParams.set('api-version', this.apiVersion);
    const body = await this.post(endpoint, { 'api-key': this.config.aiApiKey ?? '' }, {
      stream: true,
      max_tokens: 4096,
      messages,
    }, signal);
    return parseOpenAiCompatibleStream(body, this.config.chatMaxResponseBytes);
  }
}
