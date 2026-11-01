import { z } from 'zod';
export declare function parseOrThrow<T>(schema: z.ZodType<T>, value: unknown): T;
export declare function safeParse<T>(schema: z.ZodType<T>, value: unknown): z.ZodSafeParseResult<T>;
