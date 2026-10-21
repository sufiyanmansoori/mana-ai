import type { NextFunction, Request, Response } from 'express';
import type { AppLogger } from '../logger.js';
export declare function requestIdAndLogging(logger: AppLogger): (request: Request, response: Response, next: NextFunction) => void;
