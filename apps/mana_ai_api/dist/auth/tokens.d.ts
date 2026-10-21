import type { AppConfig } from '../config.js';
export interface AuthenticatedUser {
    subject: string;
}
export type TokenVerifier = (token: string) => Promise<AuthenticatedUser>;
export declare function createTokenVerifier(config: AppConfig): TokenVerifier;
export declare function createLocalAccessToken(subject: string, secret: string, expiresInSeconds?: number): Promise<string>;
