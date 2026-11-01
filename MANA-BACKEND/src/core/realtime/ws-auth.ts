import type { IncomingMessage } from 'node:http';
import type { TokenVerifier, AuthenticatedUser } from '../../auth/tokens.js';

export async function authenticateWebSocketUpgrade(
  request: IncomingMessage,
  verify: TokenVerifier,
): Promise<AuthenticatedUser | undefined> {
  const authorization = request.headers.authorization;
  const match = typeof authorization === 'string'
    ? /^Bearer ([^\s]+)$/u.exec(authorization)
    : null;
  return match ? verify(match[1]!) : undefined;
}
