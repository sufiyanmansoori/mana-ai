export const QUEUE_NAMES = {
  emailDelivery: 'email-delivery',
  imageGeneration: 'image-generation',
  notificationDelivery: 'notification-delivery',
  documentProcessing: 'document-processing',
  webhookReconciliation: 'webhook-reconciliation',
} as const;

export type QueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES];

export const QUEUE_DEFAULTS = {
  concurrency: 10,
  attempts: 3,
  backoff: 'exponential',
} as const;

// Names are reserved for future workers; no queue is active in this API yet.
