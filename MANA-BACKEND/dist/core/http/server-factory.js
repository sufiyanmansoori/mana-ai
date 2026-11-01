import express from 'express';
export function createHttpServer(configure) {
    const app = express();
    app.disable('x-powered-by');
    configure(app);
    return app;
}
//# sourceMappingURL=server-factory.js.map