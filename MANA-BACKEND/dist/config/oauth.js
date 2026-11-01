export function createOAuthRuntimeConfig(env) {
    return {
        ...(provider(env.OAUTH_GOOGLE_CLIENT_ID, env.OAUTH_GOOGLE_CLIENT_SECRET, env.OAUTH_GOOGLE_REDIRECT_URL, 'Google', env.NODE_ENV)),
        ...(provider(env.OAUTH_APPLE_CLIENT_ID, env.OAUTH_APPLE_CLIENT_SECRET, env.OAUTH_APPLE_REDIRECT_URL, 'Apple', env.NODE_ENV)),
        ...(provider(env.OAUTH_MICROSOFT_CLIENT_ID, env.OAUTH_MICROSOFT_CLIENT_SECRET, env.OAUTH_MICROSOFT_REDIRECT_URL, 'Microsoft', env.NODE_ENV)),
    };
}
function provider(clientId, clientSecret, redirectUrl, name, environment) {
    const values = [clientId, clientSecret, redirectUrl];
    if (values.every((value) => value === undefined))
        return {};
    if (values.some((value) => value === undefined)) {
        throw new Error(`${name} OAuth requires client ID, client secret, and redirect URL.`);
    }
    const [resolvedClientId, resolvedClientSecret, resolvedRedirectUrl] = values;
    if (!resolvedClientId || !resolvedClientSecret || !resolvedRedirectUrl) {
        throw new Error(`${name} OAuth requires client ID, client secret, and redirect URL.`);
    }
    if (environment === 'production' && new URL(resolvedRedirectUrl).protocol !== 'https:') {
        throw new Error(`${name} OAuth redirect URL must use HTTPS in production.`);
    }
    return {
        [name.toLowerCase()]: {
            clientId: resolvedClientId,
            clientSecret: resolvedClientSecret,
            redirectUrl: resolvedRedirectUrl,
        },
    };
}
//# sourceMappingURL=oauth.js.map