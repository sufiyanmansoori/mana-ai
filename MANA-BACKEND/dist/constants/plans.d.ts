export declare const SUBSCRIPTION_STATUSES: readonly ["trialing", "active", "past_due", "canceled", "incomplete"];
export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUSES)[number];
export declare const BILLING_INTERVALS: readonly ["month", "year"];
export type BillingInterval = (typeof BILLING_INTERVALS)[number];
export declare const DEFAULT_PLAN_CURRENCY = "INR";
