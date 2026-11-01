export declare const LIMITS: {
    readonly apiPort: {
        readonly min: 1;
        readonly max: 65535;
        readonly default: 3000;
    };
    readonly apiBodyBytes: {
        readonly min: 1024;
        readonly max: number;
        readonly default: number;
    };
    readonly apiShutdownMs: {
        readonly min: 1000;
        readonly max: 120000;
        readonly default: 15000;
    };
    readonly databasePool: {
        readonly min: 1;
        readonly max: 200;
        readonly default: 20;
    };
    readonly databaseIdleTimeoutMs: {
        readonly min: 1000;
        readonly max: 300000;
        readonly default: 30000;
    };
    readonly databaseConnectTimeoutMs: {
        readonly min: 100;
        readonly max: 120000;
        readonly default: 5000;
    };
    readonly chatRequestsPerMinute: {
        readonly min: 1;
        readonly max: 1000;
        readonly default: 20;
    };
    readonly chatInputMessages: {
        readonly min: 1;
        readonly max: 100;
        readonly default: 100;
    };
    readonly chatMessageCharacters: {
        readonly min: 1;
        readonly max: 100000;
        readonly default: 20000;
    };
    readonly chatResponseBytes: {
        readonly min: 1024;
        readonly max: number;
        readonly default: number;
    };
    readonly conversationPage: {
        readonly min: 1;
        readonly max: 10000;
        readonly default: 1;
    };
    readonly conversationPageSize: {
        readonly min: 1;
        readonly max: 100;
        readonly default: 25;
    };
    readonly messagePageSize: {
        readonly min: 1;
        readonly max: 100;
        readonly default: 100;
    };
    readonly folderNameCharacters: {
        readonly min: 1;
        readonly max: 40;
    };
    readonly conversationTitleCharacters: {
        readonly min: 1;
        readonly max: 120;
    };
    readonly modelIdCharacters: {
        readonly min: 1;
        readonly max: 128;
    };
    readonly adminSubjectCharacters: {
        readonly min: 1;
        readonly max: 255;
    };
    readonly featureFlagKeyCharacters: {
        readonly min: 2;
        readonly max: 64;
    };
    readonly featureFlagDescriptionCharacters: {
        readonly min: 1;
        readonly max: 500;
    };
    readonly adminRecordIdCharacters: {
        readonly min: 1;
        readonly max: 128;
    };
    readonly imagePromptCharacters: {
        readonly min: 1;
        readonly max: 4000;
    };
    readonly publicCategoryCacheSeconds: 60;
    readonly publicProductCacheSeconds: 30;
    readonly rateLimitWindowMs: {
        readonly min: 1000;
        readonly max: 3600000;
        readonly default: 60000;
    };
    readonly globalRateLimitRequests: {
        readonly min: 1;
        readonly max: 100000;
        readonly default: 120;
    };
};
