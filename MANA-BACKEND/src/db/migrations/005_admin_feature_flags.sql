CREATE TABLE IF NOT EXISTS admin_feature_flags (
  flag_key text PRIMARY KEY
    CHECK (flag_key ~ '^[a-z][a-z0-9_.-]{1,63}$'),
  description text NOT NULL
    CHECK (char_length(description) BETWEEN 1 AND 500),
  enabled boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by text NOT NULL CHECK (char_length(updated_by) BETWEEN 1 AND 255)
);

CREATE TABLE IF NOT EXISTS admin_feature_flag_audit (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  flag_key text NOT NULL,
  action text NOT NULL CHECK (action IN ('created', 'updated', 'deleted')),
  actor_subject text NOT NULL CHECK (char_length(actor_subject) BETWEEN 1 AND 255),
  previous_value jsonb,
  new_value jsonb,
  occurred_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS admin_feature_flag_audit_occurred_idx
  ON admin_feature_flag_audit (occurred_at DESC, id DESC);
