export declare class ApiKeyManager {
    private readonly secret;
    constructor(secret: string);
    create(): {
        key: string;
        digest: string;
    };
    verify(key: string, expectedDigest: string): boolean;
    private digest;
}
