CREATE TABLE IF NOT EXISTS permissions (
  permission_key text PRIMARY KEY CHECK (permission_key ~ '^[a-z][a-z0-9:._-]{1,127}$'),
  description text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS role_permissions (
  role_key text NOT NULL REFERENCES roles(role_key) ON DELETE CASCADE,
  permission_key text NOT NULL REFERENCES permissions(permission_key) ON DELETE CASCADE,
  PRIMARY KEY (role_key, permission_key)
);
