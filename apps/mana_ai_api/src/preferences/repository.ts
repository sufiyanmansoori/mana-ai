import type { Pool } from 'pg';
import type { UpdatePreferences, UserPreferences } from './schemas.js';

export class PreferencesRepository {
  constructor(private readonly pool: Pool) {}

  async get(subject: string, defaultModel: string): Promise<UserPreferences> {
    const result = await this.pool.query<UserPreferences>(
      `SELECT locale, theme_mode, default_model, updated_at
       FROM user_preferences
       WHERE owner_subject = $1`,
      [subject],
    );
    return result.rows[0] ?? {
      locale: 'en',
      theme_mode: 'system',
      default_model: defaultModel,
      updated_at: null,
    };
  }

  async update(
    subject: string,
    defaultModel: string,
    preferences: UpdatePreferences,
  ): Promise<UserPreferences> {
    const result = await this.pool.query<UserPreferences>(
      `INSERT INTO user_preferences (
         owner_subject, locale, theme_mode, default_model
       ) VALUES ($1, $2, $3, $4)
       ON CONFLICT (owner_subject) DO UPDATE SET
         locale = CASE WHEN $5::boolean THEN $2 ELSE user_preferences.locale END,
         theme_mode = CASE WHEN $6::boolean THEN $3 ELSE user_preferences.theme_mode END,
         default_model = CASE WHEN $7::boolean THEN $4 ELSE user_preferences.default_model END,
         updated_at = now()
       RETURNING locale, theme_mode, default_model, updated_at`,
      [
        subject,
        preferences.locale ?? 'en',
        preferences.theme_mode ?? 'system',
        preferences.default_model ?? defaultModel,
        preferences.locale !== undefined,
        preferences.theme_mode !== undefined,
        preferences.default_model !== undefined,
      ],
    );
    return result.rows[0]!;
  }

  async reset(subject: string): Promise<void> {
    await this.pool.query(
      'DELETE FROM user_preferences WHERE owner_subject = $1',
      [subject],
    );
  }
}
