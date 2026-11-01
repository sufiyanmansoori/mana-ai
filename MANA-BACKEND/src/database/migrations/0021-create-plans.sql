CREATE TABLE IF NOT EXISTS plans (
  plan_key text PRIMARY KEY CHECK (plan_key ~ '^[a-z][a-z0-9_-]{1,63}$'),
  display_name text NOT NULL CHECK (char_length(display_name) BETWEEN 1 AND 120),
  description text NOT NULL DEFAULT '',
  currency char(3),
  price_minor bigint CHECK (price_minor IS NULL OR price_minor >= 0),
  billing_interval text CHECK (billing_interval IS NULL OR billing_interval IN ('month', 'year')),
  limits jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(limits) = 'object'),
  is_active boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK ((price_minor IS NULL AND currency IS NULL) OR
         (price_minor IS NOT NULL AND currency IS NOT NULL))
);
