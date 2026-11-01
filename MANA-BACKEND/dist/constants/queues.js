export const QUEUE_NAMES = {
    emailDelivery: 'email-delivery',
    imageGeneration: 'image-generation',
    notificationDelivery: 'notification-delivery',
    documentProcessing: 'document-processing',
    webhookReconciliation: 'webhook-reconciliation',
};
export const QUEUE_DEFAULTS = {
    concurrency: 10,
    attempts: 3,
    backoff: 'exponential',
};
// Names are reserved for future workers; no queue is active in this API yet.
//# sourceMappingURL=queues.js.map