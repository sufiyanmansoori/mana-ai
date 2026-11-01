import { randomUUID } from 'node:crypto';
export function createUuid() {
    return randomUUID();
}
export function isUuid(value) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu.test(value);
}
//# sourceMappingURL=uuid.js.map