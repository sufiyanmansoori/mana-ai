CREATE TABLE IF NOT EXISTS push_tokens (
  id uuid PRIMARY KEY,
  user_subject text NOT NULL REFERENCES users(subject) ON DELETE CASCADE,
  provider text NOT NULL CHECK (provider IN ('apns', 'fcm', 'web_push')),
  token_hash char(64) NOT NULL UNIQUE CHECK (token_hash ~ '^[a-f0-9]{64}$'),
  token_ciphertext bytea NOT NULL,
  device_id text,
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS push_tokens_user_active_idx
  ON push_tokens (user_subject, provider) WHERE revoked_at IS NULL;
