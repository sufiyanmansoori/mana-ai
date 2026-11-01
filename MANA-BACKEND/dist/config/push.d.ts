import type { ParsedEnvironment } from './env-schema.js';
export type PushRuntimeConfig = {
    provider: 'disabled';
} | {
    provider: 'firebase';
    projectId: string;
    clientEmail: string;
    privateKey: string;
} | {
    provider: 'apns';
    keyId: string;
    teamId: string;
    bundleId: string;
    privateKey: string;
    environment: 'sandbox' | 'production';
};
export declare function createPushRuntimeConfig(env: ParsedEnvironment): PushRuntimeConfig;
