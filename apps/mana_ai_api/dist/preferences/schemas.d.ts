import { z } from 'zod';
export declare const UpdatePreferencesSchema: z.ZodEffects<z.ZodObject<{
    locale: z.ZodOptional<z.ZodString>;
    theme_mode: z.ZodOptional<z.ZodEnum<["system", "light", "dark"]>>;
    default_model: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    locale?: string | undefined;
    theme_mode?: "system" | "light" | "dark" | undefined;
    default_model?: string | undefined;
}, {
    locale?: string | undefined;
    theme_mode?: "system" | "light" | "dark" | undefined;
    default_model?: string | undefined;
}>, {
    locale?: string | undefined;
    theme_mode?: "system" | "light" | "dark" | undefined;
    default_model?: string | undefined;
}, {
    locale?: string | undefined;
    theme_mode?: "system" | "light" | "dark" | undefined;
    default_model?: string | undefined;
}>;
export type UpdatePreferences = z.infer<typeof UpdatePreferencesSchema>;
export interface UserPreferences {
    locale: string;
    theme_mode: 'system' | 'light' | 'dark';
    default_model: string;
    updated_at: Date | null;
}
