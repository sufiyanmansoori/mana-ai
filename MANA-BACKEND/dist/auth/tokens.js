import { createRemoteJWKSet, jwtVerify, SignJWT, } from 'jose';
import { ApiError } from '../errors.js';
export function createTokenVerifier(config) {
    const issuer = config.oidcIssuerUrl;
    const jwksUrl = config.oidcJwksUrl;
    const audience = config.oidcAudience;
    if (issuer && jwksUrl && audience) {
        const jwks = createRemoteJWKSet(new URL(jwksUrl));
        return async (token) => {
            const { payload } = await jwtVerify(token, jwks, {
                issuer,
                audience,
                ...(config.authConfig
                    ? { clockTolerance: config.authConfig.clockToleranceSeconds }
                    : {}),
            });
            return requireSubject(payload);
        };
    }
    if (config.nodeEnv !== 'production' && config.localJwtSecret) {
        const secret = config.localJwtSecret;
        const key = new TextEncoder().encode(secret);
        return async (token) => {
            const { payload } = await jwtVerify(token, key, {
                algorithms: ['HS256'],
                issuer: 'mana-ai-local',
                audience: 'mana-ai-api',
                ...(config.authConfig
                    ? { clockTolerance: config.authConfig.clockToleranceSeconds }
                    : {}),
            });
            return requireSubject(payload);
        };
    }
    throw new Error('No supported access-token verifier is configured.');
}
export async function createLocalAccessToken(subject, secret, expiresInSeconds = 3600) {
    return new SignJWT({})
        .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
        .setSubject(subject)
        .setIssuer('mana-ai-local')
        .setAudience('mana-ai-api')
        .setIssuedAt()
        .setExpirationTime(`${expiresInSeconds}s`)
        .sign(new TextEncoder().encode(secret));
}
function requireSubject(payload) {
    if (typeof payload.sub !== 'string' || payload.sub.trim().length === 0) {
        throw new ApiError(401, 'invalid_access_token', 'The access token is invalid.');
    }
    return { subject: payload.sub };
}
//# sourceMappingURL=tokens.js.map