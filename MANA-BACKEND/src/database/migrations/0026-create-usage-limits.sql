CREATE TABLE IF NOT EXISTS usage_limits (
  id uuid PRIMARY KEY,
  plan_key text REFERENCES plans(plan_key) ON DELETE CASCADE,
  user_subject text REFERENCES users(subject) ON DELETE CASCADE,
  usage_type text NOT NULL CHECK (char_length(usage_type) BETWEEN 1 AND 64),
  maximum bigint NOT NULL CHECK (maximum >= 0),
  window_seconds integer NOT NULL CHECK (window_seconds > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK ((plan_key IS NULL) <> (user_subject IS NULL))
);
CREATE UNIQUE INDEX IF NOT EXISTS usage_limits_plan_type_idx
  ON usage_limits (plan_key, usage_type) WHERE plan_key IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS usage_limits_user_type_idx
  ON usage_limits (user_subject, usage_type) WHERE user_subject IS NOT NULL;
