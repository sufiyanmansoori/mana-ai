import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
export function sha256(value) {
    return createHash('sha256').update(value).digest('hex');
}
export function randomToken(bytes = 32) {
    if (!Number.isSafeInteger(bytes) || bytes < 16 || bytes > 1024) {
        throw new RangeError('Token entropy must be between 16 and 1024 bytes.');
    }
    return randomBytes(bytes).toString('base64url');
}
export function constantTimeEqual(left, right) {
    const leftBuffer = Buffer.from(left);
    const rightBuffer = Buffer.from(right);
    return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}
//# sourceMappingURL=hash.js.map