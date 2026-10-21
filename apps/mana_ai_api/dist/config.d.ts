export interface AppConfig {
    nodeEnv: 'development' | 'test' | 'production';
    host: string;
    port: number;
    corsOrigins: string[];
    databaseUrl: string;
    databaseSsl: 'disable' | 'require';
    localJwtSecret?: string;
    oidcIssuerUrl?: string;
    oidcJwksUrl?: string;
    oidcAudience?: string;
    aiBaseUrl: string;
    aiApiKey?: string;
    aiModel: string;
    aiAllowedModels: string[];
    aiTimeoutMs: number;
    chatRateLimitPerMinute: number;
    chatMaxInputMessages: number;
    chatMaxMessageCharacters: number;
    chatMaxResponseBytes: number;
    logLevel: string;
}
export declare function loadConfig(source?: NodeJS.ProcessEnv): AppConfig;
