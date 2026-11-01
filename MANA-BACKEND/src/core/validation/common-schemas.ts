import { z } from 'zod';

export const UuidSchema = z.string().uuid();
export const NonEmptyStringSchema = z.string().trim().min(1);
export const EmailSchema = z.string().trim().email().max(254);
export const IsoDateTimeSchema = z.string().datetime({ offset: true });
export const SafeIntegerSchema = z.number().int().safe();
