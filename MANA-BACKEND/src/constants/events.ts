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
} as const;

export type DomainEventName = (typeof DOMAIN_EVENTS)[keyof typeof DOMAIN_EVENTS];

export const ADMIN_AUDIT_ACTION = {
  created: 'created',
  updated: 'updated',
  deleted: 'deleted',
} as const;
export const ADMIN_AUDIT_ACTIONS = Object.values(ADMIN_AUDIT_ACTION);
export type AdminAuditAction = (typeof ADMIN_AUDIT_ACTION)[keyof typeof ADMIN_AUDIT_ACTION];
