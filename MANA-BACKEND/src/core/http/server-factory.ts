import express, { type Express } from 'express';

export function createHttpServer(configure: (app: Express) => void): Express {
  const app = express();
  app.disable('x-powered-by');
  configure(app);
  return app;
}
