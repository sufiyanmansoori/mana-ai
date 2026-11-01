import type { ParsedEnvironment } from './env-schema.js';
export type MailRuntimeConfig = {
    provider: 'disabled';
} | {
    provider: 'smtp';
    from: string;
    host: string;
    port: number;
    secure: boolean;
    user?: string;
    password?: string;
} | {
    provider: 'sendgrid';
    from: string;
    apiKey: string;
} | {
    provider: 'ses';
    from: string;
    region: string;
};
export declare function createMailRuntimeConfig(env: ParsedEnvironment): MailRuntimeConfig;
