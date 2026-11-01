CREATE TABLE IF NOT EXISTS app_settings (
  namespace text NOT NULL CHECK (namespace ~ '^[a-z][a-z0-9_.-]{1,63}$'),
  setting_key text NOT NULL CHECK (setting_key ~ '^[a-z][a-z0-9_.-]{1,127}$'),
  value jsonb NOT NULL,
  is_secret boolean NOT NULL DEFAULT false,
  updated_by text REFERENCES users(subject) ON DELETE SET NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (namespace, setting_key),
  CHECK (is_secret = false OR jsonb_typeof(value) = 'string')
);

CREATE TABLE IF NOT EXISTS languages (
  locale text PRIMARY KEY CHECK (locale ~ '^[a-z]{2,3}(?:-[A-Z]{2})?$'),
  display_name text NOT NULL CHECK (char_length(display_name) BETWEEN 1 AND 80),
  is_enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
