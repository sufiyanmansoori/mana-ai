import { z } from 'zod';
import { LIMITS } from '../constants/limits.js';
import { REGEX } from '../constants/regex.js';
const FeatureFlagKeySchema = z.string().regex(REGEX.featureFlagKey, 'Use 2–64 lowercase letters, numbers, dots, underscores, or hyphens.');
export const CreateFeatureFlagSchema = z.object({
    key: FeatureFlagKeySchema,
    description: z.string().trim()
        .min(LIMITS.featureFlagDescriptionCharacters.min)
        .max(LIMITS.featureFlagDescriptionCharacters.max),
    enabled: z.boolean().default(false),
}).strict();
export const UpdateFeatureFlagSchema = z.object({
    enabled: z.boolean(),
}).strict();
export const FeatureFlagKeyParamSchema = z.object({
    key: FeatureFlagKeySchema,
});
export const FeatureFlagAuditQuerySchema = z.object({
    limit: z.coerce.number().int().min(1).max(100).default(50),
}).strict();
//# sourceMappingURL=schemas.js.map