import { z } from 'zod';
export declare const CreateFeatureFlagSchema: z.ZodObject<{
    key: z.ZodString;
    description: z.ZodString;
    enabled: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strict>;
export declare const UpdateFeatureFlagSchema: z.ZodObject<{
    enabled: z.ZodBoolean;
}, z.core.$strict>;
export declare const FeatureFlagKeyParamSchema: z.ZodObject<{
    key: z.ZodString;
}, z.core.$strip>;
export declare const FeatureFlagAuditQuerySchema: z.ZodObject<{
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strict>;
