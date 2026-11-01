export const DOMAIN_EVENTS = {
    adminFeatureFlagCreated: 'admin.feature_flag.created',
    adminFeatureFlagDeleted: 'admin.feature_flag.deleted',
    adminFeatureFlagUpdated: 'admin.feature_flag.updated',
    chatResponseCompleted: 'chat.response.completed',
    chatResponseFailed: 'chat.response.failed',
    conversationArchived: 'conversation.archived',
    conversationCreated: 'conversation.created',
    imageGenerationCompleted: 'image.generation.completed',
    userPreferencesUpdated: 'user.preferences.updated',
};
export const ADMIN_AUDIT_ACTION = {
    created: 'created',
    updated: 'updated',
    deleted: 'deleted',
};
export const ADMIN_AUDIT_ACTIONS = Object.values(ADMIN_AUDIT_ACTION);
//# sourceMappingURL=events.js.map