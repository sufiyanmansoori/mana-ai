CREATE TABLE IF NOT EXISTS users (
  subject text PRIMARY KEY CHECK (char_length(subject) BETWEEN 1 AND 255),
  email text,
  display_name text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'deleted')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz,
  CHECK (email IS NULL OR char_length(email) <= 254),
  CHECK (display_name IS NULL OR char_length(display_name) <= 160)
);

CREATE UNIQUE INDEX IF NOT EXISTS users_email_lower_idx
  ON users (lower(email)) WHERE email IS NOT NULL AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS users_status_created_idx ON users (status, created_at DESC);
