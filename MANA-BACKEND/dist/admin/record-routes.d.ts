import { Router } from 'express';
import type { AppConfig } from '../config.js';
import type { TokenVerifier } from '../auth/tokens.js';
import type { AdminRecordRepositoryPort } from './record-repository.js';
export declare function createAdminRecordRouter(input: {
    config: AppConfig;
    verifier: TokenVerifier;
    repository: AdminRecordRepositoryPort;
}): Router;
