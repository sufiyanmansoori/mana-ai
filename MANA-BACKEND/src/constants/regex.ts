export const REGEX = {
  featureFlagKey: /^[a-z][a-z0-9_.-]{1,63}$/u,
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/u,
  modelId: /^[A-Za-z0-9._:-]{1,128}$/u,
  localeTag: /^[a-z]{2,3}(?:-[A-Z]{2})?$/u,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/u,
  apiKeyName: /^[a-zA-Z][a-zA-Z0-9_-]{1,63}$/u,
  printable: /^[\x20-\x7E]+$/u,
} as const;
