import type { ParsedEnvironment } from './env-schema.js';

export interface SearchRuntimeConfig {
  enabled: boolean;
  minimumQueryLength: number;
  maximumResults: number;
  timeoutMs: number;
}

export function createSearchRuntimeConfig(env: ParsedEnvironment): SearchRuntimeConfig {
  return {
    enabled: env.SEARCH_ENABLED,
    minimumQueryLength: env.SEARCH_MIN_QUERY_LENGTH,
    maximumResults: env.SEARCH_MAX_RESULTS,
    timeoutMs: env.SEARCH_TIMEOUT_MS,
  };
}
