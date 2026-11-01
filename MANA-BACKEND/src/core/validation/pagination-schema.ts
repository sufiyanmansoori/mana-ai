import { z } from 'zod';
import { LIMITS } from '../../constants/limits.js';

export const PaginationSchema = z.object({
  page: z.coerce.number().int()
    .min(LIMITS.conversationPage.min).max(LIMITS.conversationPage.max)
    .default(LIMITS.conversationPage.default),
  limit: z.coerce.number().int()
    .min(LIMITS.conversationPageSize.min).max(LIMITS.conversationPageSize.max)
    .default(LIMITS.conversationPageSize.default),
}).strict();

export type Pagination = z.infer<typeof PaginationSchema>;
