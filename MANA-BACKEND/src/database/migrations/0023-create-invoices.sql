CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY,
  user_subject text NOT NULL REFERENCES users(subject) ON DELETE RESTRICT,
  subscription_id uuid REFERENCES subscriptions(id) ON DELETE SET NULL,
  provider text NOT NULL CHECK (provider IN ('stripe', 'razorpay', 'paypal', 'manual')),
  provider_invoice_id text,
  status text NOT NULL CHECK (status IN ('draft', 'open', 'paid', 'void', 'uncollectible')),
  amount_due_minor bigint NOT NULL CHECK (amount_due_minor >= 0),
  amount_paid_minor bigint NOT NULL DEFAULT 0 CHECK (amount_paid_minor >= 0),
  currency char(3) NOT NULL,
  due_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (provider, provider_invoice_id)
);
CREATE INDEX IF NOT EXISTS invoices_user_recent_idx ON invoices (user_subject, created_at DESC);
