import cors, { type CorsOptions } from 'cors';

export function corsMiddleware(options: CorsOptions): ReturnType<typeof cors> {
  return cors(options);
}
