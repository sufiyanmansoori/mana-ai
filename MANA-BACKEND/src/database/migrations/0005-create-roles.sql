CREATE TABLE IF NOT EXISTS roles (
  role_key text PRIMARY KEY CHECK (role_key ~ '^[a-z][a-z0-9_-]{1,63}$'),
  description text NOT NULL DEFAULT '',
  is_system boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_roles (
  user_subject text NOT NULL REFERENCES users(subject) ON DELETE CASCADE,
  role_key text NOT NULL REFERENCES roles(role_key) ON DELETE RESTRICT,
  granted_by text REFERENCES users(subject) ON DELETE SET NULL,
  granted_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_subject, role_key)
);
CREATE INDEX IF NOT EXISTS user_roles_role_idx ON user_roles (role_key, user_subject);
