import { z } from 'zod';
import { LIMITS } from '../constants/limits.js';
export const AdminRecordIdSchema = z.string()
    .trim()
    .min(LIMITS.adminRecordIdCharacters.min)
    .max(LIMITS.adminRecordIdCharacters.max)
    .refine((value) => [...value].every((character) => {
    const codePoint = character.charCodeAt(0);
    return codePoint >= 0x20 && codePoint !== 0x7f;
}));
export const AdminRecordQuerySchema = z.object({
    limit: z.coerce.number().int().min(1).max(100).default(20),
    cursor: z.string().min(1).max(512).optional(),
}).strict();
export const AdminRecordBodySchema = z.object({
    createdAt: z.string().datetime({ offset: true }),
}).strict();
//# sourceMappingURL=record-schemas.js.map