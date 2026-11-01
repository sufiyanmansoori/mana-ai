import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

export class EncryptionService {
  constructor(private readonly key: Buffer) {
    if (key.byteLength !== 32) throw new Error('AES-256-GCM requires a 32-byte key.');
  }

  encrypt(plaintext: string): string {
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', this.key, iv);
    const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    return [iv, cipher.getAuthTag(), ciphertext].map((part) => part.toString('base64url')).join('.');
  }

  decrypt(encrypted: string): string {
    const parts = encrypted.split('.');
    if (parts.length !== 3) throw new TypeError('Encrypted value has an invalid format.');
    const [iv, tag, ciphertext] = parts.map((part) => Buffer.from(part!, 'base64url'));
    if (iv!.length !== 12 || tag!.length !== 16) throw new TypeError('Encrypted value has invalid parameters.');
    const decipher = createDecipheriv('aes-256-gcm', this.key, iv!);
    decipher.setAuthTag(tag!);
    return Buffer.concat([decipher.update(ciphertext!), decipher.final()]).toString('utf8');
  }
}
