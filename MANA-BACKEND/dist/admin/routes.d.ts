import { Router } from 'express';
import type { AppConfig } from '../config.js';
import type { TokenVerifier } from '../auth/tokens.js';
import { AdminFeatureFlagRepository, type AdminFeatureFlagRepositoryPort } from './feature-flag-repository.js';
export declare function createAdminRouter(input: {
    config: AppConfig;
    verifier: TokenVerifier;
    repository: AdminFeatureFlagRepositoryPort;
}): Router;
export { AdminFeatureFlagRepository };
