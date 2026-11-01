export async function authenticateWebSocketUpgrade(request, verify) {
    const authorization = request.headers.authorization;
    const match = typeof authorization === 'string'
        ? /^Bearer ([^\s]+)$/u.exec(authorization)
        : null;
    return match ? verify(match[1]) : undefined;
}
//# sourceMappingURL=ws-auth.js.map