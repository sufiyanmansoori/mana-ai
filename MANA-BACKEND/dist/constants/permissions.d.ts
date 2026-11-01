export declare const PERMISSIONS: {
    readonly conversationReadOwn: "conversation:read:own";
    readonly conversationWriteOwn: "conversation:write:own";
    readonly imageGenerate: "image:generate";
    readonly preferencesReadOwn: "preferences:read:own";
    readonly preferencesWriteOwn: "preferences:write:own";
    readonly adminFeatureFlagsManage: "admin:feature-flags:manage";
    readonly adminRecordsManage: "admin:records:manage";
};
export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
export declare const ROLE_PERMISSIONS: {
    readonly user: readonly ["conversation:read:own", "conversation:write:own", "image:generate", "preferences:read:own", "preferences:write:own"];
    readonly admin: readonly ["conversation:read:own", "conversation:write:own", "image:generate", "preferences:read:own", "preferences:write:own", "admin:feature-flags:manage", "admin:records:manage"];
};
