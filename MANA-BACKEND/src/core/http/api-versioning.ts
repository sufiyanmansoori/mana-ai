import type { RequestHandler, Router } from 'express';

export function mountApiVersion(
  app: { use(path: string, router: Router): unknown },
  version: number,
  router: Router,
): void {
  if (!Number.isSafeInteger(version) || version < 1) throw new RangeError('API version must be positive.');
  app.use(`/v${version}`, router);
}

export const requireAcceptHeader: RequestHandler = (request, response, next) => {
  const accept = request.get('accept');
  if (accept && !accept.includes('*/*') && !accept.includes('application/json')) {
    response.status(406).json({ error: { code: 'not_acceptable' } });
    return;
  }
  next();
};
