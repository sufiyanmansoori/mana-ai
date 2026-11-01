import type { IncomingMessage } from 'node:http';
import type { TokenVerifier, AuthenticatedUser } from '../../auth/tokens.js';
export declare function authenticateWebSocketUpgrade(request: IncomingMessage, verify: TokenVerifier): Promise<AuthenticatedUser | undefined>;
