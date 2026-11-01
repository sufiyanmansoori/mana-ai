CREATE TABLE IF NOT EXISTS auth_sessions (
  id uuid PRIMARY KEY,
  user_subject text NOT NULL REFERENCES users(subject) ON DELETE CASCADE,
  refresh_token_hash char(64) NOT NULL UNIQUE CHECK (refresh_token_hash ~ '^[a-f0-9]{64}$'),
  user_agent text,
  ip_address inet,
  expires_at timestamptz NOT NULL,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_used_at timestamptz,
  CHECK (user_agent IS NULL OR char_length(user_agent) <= 1024)
);
CREATE INDEX IF NOT EXISTS auth_sessions_user_expiry_idx
  ON auth_sessions (user_subject, expires_at DESC) WHERE revoked_at IS NULL;
