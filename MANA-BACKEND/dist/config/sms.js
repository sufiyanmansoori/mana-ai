export function createSmsRuntimeConfig(env) {
    if (env.SMS_PROVIDER === 'disabled')
        return { provider: 'disabled' };
    if (env.SMS_PROVIDER === 'twilio') {
        const { SMS_TWILIO_ACCOUNT_SID, SMS_TWILIO_AUTH_TOKEN, SMS_TWILIO_FROM_NUMBER } = env;
        if (!SMS_TWILIO_ACCOUNT_SID || !SMS_TWILIO_AUTH_TOKEN || !SMS_TWILIO_FROM_NUMBER) {
            throw new Error('Twilio SMS requires account SID, auth token, and sender number.');
        }
        return {
            provider: 'twilio',
            accountSid: SMS_TWILIO_ACCOUNT_SID,
            authToken: SMS_TWILIO_AUTH_TOKEN,
            fromNumber: SMS_TWILIO_FROM_NUMBER,
        };
    }
    if (!env.AWS_REGION)
        throw new Error('AWS_REGION is required when the SNS SMS provider is enabled.');
    return {
        provider: 'sns',
        region: env.AWS_REGION,
        ...(env.SMS_SENDER_ID ? { senderId: env.SMS_SENDER_ID } : {}),
    };
}
//# sourceMappingURL=sms.js.map