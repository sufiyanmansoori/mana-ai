import type { Pool } from 'pg';
import type { UpdatePreferences, UserPreferences } from './schemas.js';
export declare class PreferencesRepository {
    private readonly pool;
    constructor(pool: Pool);
    get(subject: string, defaultModel: string): Promise<UserPreferences>;
    update(subject: string, defaultModel: string, preferences: UpdatePreferences): Promise<UserPreferences>;
    reset(subject: string): Promise<void>;
}
