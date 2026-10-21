import type { NextFunction, Request, Response } from 'express';
import type { TokenVerifier } from './tokens.js';
export declare function requireAuthentication(verifier: TokenVerifier): (request: Request, _response: Response, next: NextFunction) => Promise<void>;
