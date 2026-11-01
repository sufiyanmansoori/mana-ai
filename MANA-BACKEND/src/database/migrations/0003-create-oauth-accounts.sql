CREATE TABLE IF NOT EXISTS oauth_accounts (
  id uuid PRIMARY KEY,
  user_subject text NOT NULL REFERENCES users(subject) ON DELETE CASCADE,
  provider text NOT NULL CHECK (provider IN ('google', 'apple', 'microsoft')),
  provider_account_id text NOT NULL CHECK (char_length(provider_account_id) BETWEEN 1 AND 255),
  access_token_ciphertext bytea,
  refresh_token_ciphertext bytea,
  token_expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (provider, provider_account_id)
);
CREATE INDEX IF NOT EXISTS oauth_accounts_user_idx ON oauth_accounts (user_subject, provider);
