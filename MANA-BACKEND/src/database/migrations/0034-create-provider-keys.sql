CREATE TABLE IF NOT EXISTS provider_keys (
  id uuid PRIMARY KEY,
  owner_subject text REFERENCES users(subject) ON DELETE CASCADE,
  provider text NOT NULL CHECK (char_length(provider) BETWEEN 1 AND 64),
  key_name text NOT NULL CHECK (char_length(key_name) BETWEEN 1 AND 64),
  key_prefix text NOT NULL CHECK (char_length(key_prefix) BETWEEN 1 AND 16),
  secret_ciphertext bytea NOT NULL,
  encryption_key_version text NOT NULL CHECK (char_length(encryption_key_version) BETWEEN 1 AND 64),
  created_by text NOT NULL REFERENCES users(subject) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz
);
CREATE INDEX IF NOT EXISTS provider_keys_active_idx
  ON provider_keys (provider, owner_subject) WHERE revoked_at IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS provider_keys_user_name_active_idx
  ON provider_keys (owner_subject, provider, key_name)
  WHERE owner_subject IS NOT NULL AND revoked_at IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS provider_keys_global_name_active_idx
  ON provider_keys (provider, key_name)
  WHERE owner_subject IS NULL AND revoked_at IS NULL;
