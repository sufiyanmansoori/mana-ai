export declare const QUEUE_NAMES: {
    readonly emailDelivery: "email-delivery";
    readonly imageGeneration: "image-generation";
    readonly notificationDelivery: "notification-delivery";
    readonly documentProcessing: "document-processing";
    readonly webhookReconciliation: "webhook-reconciliation";
};
export type QueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES];
export declare const QUEUE_DEFAULTS: {
    readonly concurrency: 10;
    readonly attempts: 3;
    readonly backoff: "exponential";
};
