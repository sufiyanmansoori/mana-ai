export const PERMISSIONS = {
    conversationReadOwn: 'conversation:read:own',
    conversationWriteOwn: 'conversation:write:own',
    imageGenerate: 'image:generate',
    preferencesReadOwn: 'preferences:read:own',
    preferencesWriteOwn: 'preferences:write:own',
    adminFeatureFlagsManage: 'admin:feature-flags:manage',
    adminRecordsManage: 'admin:records:manage',
};
export const ROLE_PERMISSIONS = {
    user: [
        PERMISSIONS.conversationReadOwn,
        PERMISSIONS.conversationWriteOwn,
        PERMISSIONS.imageGenerate,
        PERMISSIONS.preferencesReadOwn,
        PERMISSIONS.preferencesWriteOwn,
    ],
    admin: [
        PERMISSIONS.conversationReadOwn,
        PERMISSIONS.conversationWriteOwn,
        PERMISSIONS.imageGenerate,
        PERMISSIONS.preferencesReadOwn,
        PERMISSIONS.preferencesWriteOwn,
        PERMISSIONS.adminFeatureFlagsManage,
        PERMISSIONS.adminRecordsManage,
    ],
};
//# sourceMappingURL=permissions.js.map