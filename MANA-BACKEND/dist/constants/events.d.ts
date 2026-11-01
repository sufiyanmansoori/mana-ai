export declare const DOMAIN_EVENTS: {
    readonly adminFeatureFlagCreated: "admin.feature_flag.created";
    readonly adminFeatureFlagDeleted: "admin.feature_flag.deleted";
    readonly adminFeatureFlagUpdated: "admin.feature_flag.updated";
    readonly chatResponseCompleted: "chat.response.completed";
    readonly chatResponseFailed: "chat.response.failed";
    readonly conversationArchived: "conversation.archived";
    readonly conversationCreated: "conversation.created";
    readonly imageGenerationCompleted: "image.generation.completed";
    readonly userPreferencesUpdated: "user.preferences.updated";
};
export type DomainEventName = (typeof DOMAIN_EVENTS)[keyof typeof DOMAIN_EVENTS];
export declare const ADMIN_AUDIT_ACTION: {
    readonly created: "created";
    readonly updated: "updated";
    readonly deleted: "deleted";
};
export declare const ADMIN_AUDIT_ACTIONS: ("created" | "updated" | "deleted")[];
export type AdminAuditAction = (typeof ADMIN_AUDIT_ACTION)[keyof typeof ADMIN_AUDIT_ACTION];
