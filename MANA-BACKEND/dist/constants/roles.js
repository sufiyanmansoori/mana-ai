import { ROLE_PERMISSIONS } from './permissions.js';
export const ROLES = {
    user: 'user',
    admin: 'admin',
};
export function resolveRole(subject, adminSubjects) {
    return adminSubjects.includes(subject) ? ROLES.admin : ROLES.user;
}
export function roleHasPermission(role, permission) {
    const permissions = ROLE_PERMISSIONS[role];
    return permissions.includes(permission);
}
//# sourceMappingURL=roles.js.map