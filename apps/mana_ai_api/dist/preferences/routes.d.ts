import { Router } from 'express';
import type { AppConfig } from '../config.js';
import type { TokenVerifier } from '../auth/tokens.js';
import { PreferencesRepository } from './repository.js';
export declare function createPreferencesRouter(input: {
    config: AppConfig;
    verifier: TokenVerifier;
    repository: PreferencesRepository;
}): Router;
