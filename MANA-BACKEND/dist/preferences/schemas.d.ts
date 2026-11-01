import { z } from 'zod';
export declare const UpdatePreferencesSchema: z.ZodObject<{
    locale: z.ZodOptional<z.ZodString>;
    theme_mode: z.ZodOptional<z.ZodEnum<{
        system: "system";
        light: "light";
        dark: "dark";
    }>>;
    default_model: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export type UpdatePreferences = z.infer<typeof UpdatePreferencesSchema>;
export interface UserPreferences {
    locale: string;
    theme_mode: 'system' | 'light' | 'dark';
    default_model: string;
    updated_at: Date | null;
}
