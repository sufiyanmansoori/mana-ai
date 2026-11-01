import express from 'express';
export function bodyParserMiddleware(options = { limit: '1mb', strict: true }) {
    return express.json(options);
}
//# sourceMappingURL=body-parser.middleware.js.map