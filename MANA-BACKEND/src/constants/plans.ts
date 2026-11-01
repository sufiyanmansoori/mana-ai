export const SUBSCRIPTION_STATUSES = [
  'trialing',
  'active',
  'past_due',
  'canceled',
  'incomplete',
] as const;
export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUSES)[number];

export const BILLING_INTERVALS = ['month', 'year'] as const;
export type BillingInterval = (typeof BILLING_INTERVALS)[number];

export const DEFAULT_PLAN_CURRENCY = 'INR';

// Product plan IDs and prices are intentionally not declared until billing
// catalog records and provider-backed subscription flows are implemented.
