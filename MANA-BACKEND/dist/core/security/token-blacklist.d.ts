export interface TokenBlacklist {
    revoke(tokenId: string, expiresAt: number): Promise<void>;
    isRevoked(tokenId: string): Promise<boolean>;
}
export declare class InMemoryTokenBlacklist implements TokenBlacklist {
    private readonly revoked;
    revoke(tokenId: string, expiresAt: number): Promise<void>;
    isRevoked(tokenId: string): Promise<boolean>;
    private cleanup;
}
