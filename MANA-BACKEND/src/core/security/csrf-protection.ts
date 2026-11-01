import { randomBytes, timingSafeEqual } from 'node:crypto';

export function createCsrfToken(): string {
  return randomBytes(32).toString('base64url');
}

export function verifyCsrfToken(cookieToken: string | undefined, submittedToken: string | undefined): boolean {
  if (!cookieToken || !submittedToken ||
      !/^[A-Za-z0-9_-]{43}$/u.test(cookieToken) ||
      !/^[A-Za-z0-9_-]{43}$/u.test(submittedToken)) return false;
  return timingSafeEqual(Buffer.from(cookieToken), Buffer.from(submittedToken));
}
