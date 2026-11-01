import { ROLE_PERMISSIONS, type Permission } from './permissions.js';

export const ROLES = {
  user: 'user',
  admin: 'admin',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export function resolveRole(subject: string, adminSubjects: readonly string[]): Role {
  return adminSubjects.includes(subject) ? ROLES.admin : ROLES.user;
}

export function roleHasPermission(
  role: Role,
  permission: Permission,
): boolean {
  const permissions: readonly Permission[] = ROLE_PERMISSIONS[role];
  return permissions.includes(permission);
}
