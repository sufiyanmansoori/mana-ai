import type { ParsedEnvironment } from './env-schema.js';
export type SmsRuntimeConfig = {
    provider: 'disabled';
} | {
    provider: 'twilio';
    accountSid: string;
    authToken: string;
    fromNumber: string;
} | {
    provider: 'sns';
    region: string;
    senderId?: string;
};
export declare function createSmsRuntimeConfig(env: ParsedEnvironment): SmsRuntimeConfig;
