import pino from 'pino';
export function createLogger(level) {
    return pino({
        level,
        redact: {
            paths: [
                'req.headers.authorization',
                'req.headers.cookie',
                'headers.authorization',
                'headers.cookie',
                'token',
                'apiKey',
            ],
            censor: '[REDACTED]',
        },
        messageKey: 'message',
        base: { service: 'mana-ai-api' },
    });
}
//# sourceMappingURL=logger.js.map