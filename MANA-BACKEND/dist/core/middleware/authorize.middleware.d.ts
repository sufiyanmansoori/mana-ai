import type { RequestHandler } from 'express';
import type { Permission } from '../../constants/permissions.js';
export declare function requirePermission(adminSubjects: readonly string[], permission: Permission): RequestHandler;
