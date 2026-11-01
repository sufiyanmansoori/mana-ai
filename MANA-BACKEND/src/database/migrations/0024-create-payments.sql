CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY,
  invoice_id uuid REFERENCES invoices(id) ON DELETE SET NULL,
  user_subject text NOT NULL REFERENCES users(subject) ON DELETE RESTRICT,
  provider text NOT NULL CHECK (provider IN ('stripe', 'razorpay', 'paypal', 'manual')),
  provider_payment_id text,
  status text NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded', 'canceled')),
  amount_minor bigint NOT NULL CHECK (amount_minor >= 0),
  currency char(3) NOT NULL,
  processed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (provider, provider_payment_id)
);
CREATE INDEX IF NOT EXISTS payments_user_recent_idx ON payments (user_subject, created_at DESC);
