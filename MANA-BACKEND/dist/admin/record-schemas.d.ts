import { z } from 'zod';
export declare const AdminRecordIdSchema: z.ZodString;
export declare const AdminRecordQuerySchema: z.ZodObject<{
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    cursor: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const AdminRecordBodySchema: z.ZodObject<{
    createdAt: z.ZodString;
}, z.core.$strict>;
export type AdminRecordBody = z.infer<typeof AdminRecordBodySchema>;
