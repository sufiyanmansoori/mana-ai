CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY,
  user_subject text NOT NULL REFERENCES users(subject) ON DELETE CASCADE,
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 64),
  key_prefix text NOT NULL CHECK (char_length(key_prefix) BETWEEN 4 AND 16),
  key_hash char(64) NOT NULL UNIQUE CHECK (key_hash ~ '^[a-f0-9]{64}$'),
  scopes jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(scopes) = 'array'),
  expires_at timestamptz,
  revoked_at timestamptz,
  last_used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS api_keys_user_active_idx
  ON api_keys (user_subject, created_at DESC) WHERE revoked_at IS NULL;
