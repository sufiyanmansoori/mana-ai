import { z } from 'zod';
export const GenerateImageSchema = z.object({
    prompt: z.string().trim().min(1).max(4000),
    size: z.enum(['1024x1024', '1536x1024', '1024x1536']).default('1024x1024'),
}).strict();
//# sourceMappingURL=schemas.js.map