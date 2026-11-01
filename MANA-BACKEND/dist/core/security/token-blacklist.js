export class InMemoryTokenBlacklist {
    revoked = new Map();
    async revoke(tokenId, expiresAt) {
        if (!tokenId || !Number.isFinite(expiresAt))
            throw new TypeError('Token ID and expiry are required.');
        this.revoked.set(tokenId, expiresAt);
        if (this.revoked.size > 10000)
            this.cleanup(Date.now());
    }
    async isRevoked(tokenId) {
        const expiry = this.revoked.get(tokenId);
        if (expiry === undefined)
            return false;
        if (expiry <= Date.now()) {
            this.revoked.delete(tokenId);
            return false;
        }
        return true;
    }
    cleanup(now) {
        for (const [id, expiry] of this.revoked)
            if (expiry <= now)
                this.revoked.delete(id);
    }
}
//# sourceMappingURL=token-blacklist.js.map