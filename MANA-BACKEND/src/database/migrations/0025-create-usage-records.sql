CREATE TABLE IF NOT EXISTS usage_records (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_subject text NOT NULL REFERENCES users(subject) ON DELETE CASCADE,
  usage_type text NOT NULL CHECK (char_length(usage_type) BETWEEN 1 AND 64),
  quantity bigint NOT NULL CHECK (quantity >= 0),
  unit text NOT NULL CHECK (char_length(unit) BETWEEN 1 AND 32),
  model_id text,
  idempotency_key text UNIQUE,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(metadata) = 'object'),
  occurred_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS usage_records_user_type_time_idx
  ON usage_records (user_subject, usage_type, occurred_at DESC);
