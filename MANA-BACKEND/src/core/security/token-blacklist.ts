export interface TokenBlacklist {
  revoke(tokenId: string, expiresAt: number): Promise<void>;
  isRevoked(tokenId: string): Promise<boolean>;
}

export class InMemoryTokenBlacklist implements TokenBlacklist {
  private readonly revoked = new Map<string, number>();

  async revoke(tokenId: string, expiresAt: number): Promise<void> {
    if (!tokenId || !Number.isFinite(expiresAt)) throw new TypeError('Token ID and expiry are required.');
    this.revoked.set(tokenId, expiresAt);
    if (this.revoked.size > 10000) this.cleanup(Date.now());
  }

  async isRevoked(tokenId: string): Promise<boolean> {
    const expiry = this.revoked.get(tokenId);
    if (expiry === undefined) return false;
    if (expiry <= Date.now()) {
      this.revoked.delete(tokenId);
      return false;
    }
    return true;
  }

  private cleanup(now: number): void {
    for (const [id, expiry] of this.revoked) if (expiry <= now) this.revoked.delete(id);
  }
}
