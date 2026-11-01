import type { ParsedEnvironment } from './env-schema.js';

export type MailRuntimeConfig =
  | { provider: 'disabled' }
  | { provider: 'smtp'; from: string; host: string; port: number; secure: boolean; user?: string; password?: string }
  | { provider: 'sendgrid'; from: string; apiKey: string }
  | { provider: 'ses'; from: string; region: string };

export function createMailRuntimeConfig(env: ParsedEnvironment): MailRuntimeConfig {
  if (env.MAIL_PROVIDER === 'disabled') return { provider: 'disabled' };
  if (!env.MAIL_FROM) throw new Error('MAIL_FROM is required when mail is enabled.');
  switch (env.MAIL_PROVIDER) {
    case 'smtp':
      if (!env.SMTP_HOST || !env.SMTP_PORT) {
        throw new Error('SMTP_HOST and SMTP_PORT are required for SMTP mail.');
      }
      if (Boolean(env.SMTP_USER) !== Boolean(env.SMTP_PASSWORD)) {
        throw new Error('SMTP_USER and SMTP_PASSWORD must be configured together.');
      }
      return {
        provider: 'smtp',
        from: env.MAIL_FROM,
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: env.SMTP_PORT === 465,
        ...(env.SMTP_USER ? { user: env.SMTP_USER } : {}),
        ...(env.SMTP_PASSWORD ? { password: env.SMTP_PASSWORD } : {}),
      };
    case 'sendgrid':
      if (!env.SENDGRID_API_KEY) throw new Error('SENDGRID_API_KEY is required for SendGrid.');
      return { provider: 'sendgrid', from: env.MAIL_FROM, apiKey: env.SENDGRID_API_KEY };
    case 'ses':
      if (!env.AWS_REGION) throw new Error('AWS_REGION is required for SES.');
      return { provider: 'ses', from: env.MAIL_FROM, region: env.AWS_REGION };
  }
}
