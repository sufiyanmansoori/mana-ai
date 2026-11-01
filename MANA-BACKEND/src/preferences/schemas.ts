import { z } from 'zod';

export const UpdatePreferencesSchema = z.object({
  locale: z.string()
    .trim()
    .regex(/^[a-z]{2,3}(-[A-Z]{2})?$/)
    .optional(),
  theme_mode: z.enum(['system', 'light', 'dark']).optional(),
  default_model: z.string()
    .trim()
    .min(1)
    .max(128)
    .regex(/^[A-Za-z0-9._:-]+$/)
    .optional(),
}).strict().refine(
  (preferences) => Object.keys(preferences).length > 0,
  'At least one preference must be provided.',
);

export type UpdatePreferences = z.infer<typeof UpdatePreferencesSchema>;

export interface UserPreferences {
  locale: string;
  theme_mode: 'system' | 'light' | 'dark';
  default_model: string;
  updated_at: Date | null;
}
