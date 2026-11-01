export function createPaymentRuntimeConfig(env) {
    switch (env.PAYMENT_PROVIDER) {
        case 'disabled':
            return { provider: 'disabled' };
        case 'stripe':
            if (!env.STRIPE_SECRET_KEY || !env.STRIPE_WEBHOOK_SECRET) {
                throw new Error('Stripe secret and webhook secrets are both required.');
            }
            return {
                provider: 'stripe',
                secretKey: env.STRIPE_SECRET_KEY,
                webhookSecret: env.STRIPE_WEBHOOK_SECRET,
            };
        case 'razorpay':
            if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET || !env.RAZORPAY_WEBHOOK_SECRET) {
                throw new Error('Razorpay key ID, key secret, and webhook secret are required.');
            }
            return {
                provider: 'razorpay',
                keyId: env.RAZORPAY_KEY_ID,
                keySecret: env.RAZORPAY_KEY_SECRET,
                webhookSecret: env.RAZORPAY_WEBHOOK_SECRET,
            };
        case 'paypal':
            if (!env.PAYPAL_CLIENT_ID || !env.PAYPAL_CLIENT_SECRET || !env.PAYPAL_WEBHOOK_ID) {
                throw new Error('PayPal client credentials and webhook ID are required.');
            }
            if (env.NODE_ENV === 'production' && env.PAYPAL_ENVIRONMENT !== 'live') {
                throw new Error('Production PayPal configuration must use PAYPAL_ENVIRONMENT=live.');
            }
            return {
                provider: 'paypal',
                clientId: env.PAYPAL_CLIENT_ID,
                clientSecret: env.PAYPAL_CLIENT_SECRET,
                webhookId: env.PAYPAL_WEBHOOK_ID,
                environment: env.PAYPAL_ENVIRONMENT,
            };
    }
}
//# sourceMappingURL=payments.js.map