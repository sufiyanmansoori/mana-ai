import type { AuthenticatedUser } from '../auth/tokens.js';

declare global {
  namespace Express {
    interface Request {
      auth?: AuthenticatedUser;
      requestId: string;
    }
  }
}

export {};
