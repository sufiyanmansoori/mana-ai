export const SENSITIVE_LOG_PATHS = [
  'req.headers.authorization',
  'req.headers.cookie',
  'headers.authorization',
  'headers.cookie',
  'token',
  'apiKey',
  'password',
  'secret',
] as const;

export function redactObject<T>(value: T, sensitiveKeys: readonly string[] = [
  'authorization', 'cookie', 'token', 'apiKey', 'password', 'secret',
]): T {
  const keys = new Set(sensitiveKeys.map((key) => key.toLowerCase()));
  const visit = (input: unknown): unknown => {
    if (Array.isArray(input)) return input.map(visit);
    if (input === null || typeof input !== 'object') return input;
    return Object.fromEntries(Object.entries(input).map(([key, child]) => [
      key,
      keys.has(key.toLowerCase()) ? '[REDACTED]' : visit(child),
    ]));
  };
  return visit(value) as T;
}
