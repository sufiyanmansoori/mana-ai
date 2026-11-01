import { z } from 'zod';

export function parseOrThrow<T>(schema: z.ZodType<T>, value: unknown): T {
  return schema.parse(value);
}

export function safeParse<T>(schema: z.ZodType<T>, value: unknown) {
  return schema.safeParse(value);
}
