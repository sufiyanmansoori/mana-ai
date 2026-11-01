import helmet, { type HelmetOptions } from 'helmet';

export function helmetMiddleware(options: HelmetOptions = {}): ReturnType<typeof helmet> {
  return helmet(options);
}
