import express from 'express';

export function bodyParserMiddleware(
  options: Parameters<typeof express.json>[0] = { limit: '1mb', strict: true },
) {
  return express.json(options);
}
