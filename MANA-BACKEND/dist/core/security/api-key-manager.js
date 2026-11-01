import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
export class ApiKeyManager {
    secret;
    constructor(secret) {
        this.secret = secret;
        if (Buffer.byteLength(secret) < 32)
            throw new Error('API key hashing secret must be at least 32 bytes.');
    }
    create() {
        const key = randomBytes(32).toString('base64url');
        return { key, digest: this.digest(key) };
    }
    verify(key, expectedDigest) {
        if (!/^[A-Za-z0-9_-]{43}$/u.test(key) || !/^[a-f0-9]{64}$/u.test(expectedDigest))
            return false;
        const actual = Buffer.from(this.digest(key), 'hex');
        const expected = Buffer.from(expectedDigest, 'hex');
        return timingSafeEqual(actual, expected);
    }
    digest(value) {
        return createHmac('sha256', this.secret).update(value).digest('hex');
    }
}
//# sourceMappingURL=api-key-manager.js.map