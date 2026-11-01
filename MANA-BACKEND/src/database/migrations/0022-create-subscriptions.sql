CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY,
  user_subject text NOT NULL REFERENCES users(subject) ON DELETE RESTRICT,
  plan_key text NOT NULL REFERENCES plans(plan_key) ON DELETE RESTRICT,
  provider text NOT NULL CHECK (provider IN ('stripe', 'razorpay', 'paypal', 'manual')),
  provider_subscription_id text,
  status text NOT NULL CHECK (status IN ('trialing', 'active', 'past_due', 'canceled', 'incomplete')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (current_period_end IS NULL OR current_period_start IS NULL OR current_period_end > current_period_start),
  UNIQUE (provider, provider_subscription_id)
);
CREATE INDEX IF NOT EXISTS subscriptions_user_status_idx
  ON subscriptions (user_subject, status, current_period_end DESC);
