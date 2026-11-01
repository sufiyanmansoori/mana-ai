import { z } from 'zod';
export declare const GenerateImageSchema: z.ZodObject<{
    prompt: z.ZodString;
    size: z.ZodDefault<z.ZodEnum<{
        "1024x1024": "1024x1024";
        "1536x1024": "1536x1024";
        "1024x1536": "1024x1536";
    }>>;
}, z.core.$strict>;
