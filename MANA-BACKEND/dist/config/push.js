export function createPushRuntimeConfig(env) {
    if (env.PUSH_PROVIDER === 'disabled')
        return { provider: 'disabled' };
    if (env.PUSH_PROVIDER === 'firebase') {
        const { PUSH_FIREBASE_PROJECT_ID, PUSH_FIREBASE_CLIENT_EMAIL, PUSH_FIREBASE_PRIVATE_KEY } = env;
        if (!PUSH_FIREBASE_PROJECT_ID || !PUSH_FIREBASE_CLIENT_EMAIL || !PUSH_FIREBASE_PRIVATE_KEY) {
            throw new Error('Firebase push requires project ID, client email, and private key.');
        }
        return {
            provider: 'firebase',
            projectId: PUSH_FIREBASE_PROJECT_ID,
            clientEmail: PUSH_FIREBASE_CLIENT_EMAIL,
            privateKey: PUSH_FIREBASE_PRIVATE_KEY,
        };
    }
    const { PUSH_APNS_KEY_ID, PUSH_APNS_TEAM_ID, PUSH_APNS_BUNDLE_ID, PUSH_APNS_PRIVATE_KEY } = env;
    if (!PUSH_APNS_KEY_ID || !PUSH_APNS_TEAM_ID || !PUSH_APNS_BUNDLE_ID || !PUSH_APNS_PRIVATE_KEY) {
        throw new Error('APNs push requires key ID, team ID, bundle ID, and private key.');
    }
    return {
        provider: 'apns',
        keyId: PUSH_APNS_KEY_ID,
        teamId: PUSH_APNS_TEAM_ID,
        bundleId: PUSH_APNS_BUNDLE_ID,
        privateKey: PUSH_APNS_PRIVATE_KEY,
        environment: env.PUSH_APNS_ENVIRONMENT,
    };
}
//# sourceMappingURL=push.js.map