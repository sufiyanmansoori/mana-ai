export declare class EncryptionService {
    private readonly key;
    constructor(key: Buffer);
    encrypt(plaintext: string): string;
    decrypt(encrypted: string): string;
}
