import type { ParsedEnvironment } from './env-schema.js';
export type PaymentRuntimeConfig = {
    provider: 'disabled';
} | {
    provider: 'stripe';
    secretKey: string;
    webhookSecret: string;
} | {
    provider: 'razorpay';
    keyId: string;
    keySecret: string;
    webhookSecret: string;
} | {
    provider: 'paypal';
    clientId: string;
    clientSecret: string;
    webhookId: string;
    environment: 'sandbox' | 'live';
};
export declare function createPaymentRuntimeConfig(env: ParsedEnvironment): PaymentRuntimeConfig;
