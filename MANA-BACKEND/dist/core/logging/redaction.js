export const SENSITIVE_LOG_PATHS = [
    'req.headers.authorization',
    'req.headers.cookie',
    'headers.authorization',
    'headers.cookie',
    'token',
    'apiKey',
    'password',
    'secret',
];
export function redactObject(value, sensitiveKeys = [
    'authorization', 'cookie', 'token', 'apiKey', 'password', 'secret',
]) {
    const keys = new Set(sensitiveKeys.map((key) => key.toLowerCase()));
    const visit = (input) => {
        if (Array.isArray(input))
            return input.map(visit);
        if (input === null || typeof input !== 'object')
            return input;
        return Object.fromEntries(Object.entries(input).map(([key, child]) => [
            key,
            keys.has(key.toLowerCase()) ? '[REDACTED]' : visit(child),
        ]));
    };
    return visit(value);
}
//# sourceMappingURL=redaction.js.map