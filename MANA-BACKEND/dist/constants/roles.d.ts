import { type Permission } from './permissions.js';
export declare const ROLES: {
    readonly user: "user";
    readonly admin: "admin";
};
export type Role = (typeof ROLES)[keyof typeof ROLES];
export declare function resolveRole(subject: string, adminSubjects: readonly string[]): Role;
export declare function roleHasPermission(role: Role, permission: Permission): boolean;
