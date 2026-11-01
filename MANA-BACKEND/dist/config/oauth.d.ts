import type { ParsedEnvironment } from './env-schema.js';
export interface OAuthProviderConfig {
    clientId: string;
    clientSecret: string;
    redirectUrl: string;
}
export interface OAuthRuntimeConfig {
    google?: OAuthProviderConfig;
    apple?: OAuthProviderConfig;
    microsoft?: OAuthProviderConfig;
}
export declare function createOAuthRuntimeConfig(env: ParsedEnvironment): OAuthRuntimeConfig;
