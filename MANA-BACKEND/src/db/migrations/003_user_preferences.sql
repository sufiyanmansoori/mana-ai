CREATE TABLE IF NOT EXISTS user_preferences (
  owner_subject text PRIMARY KEY,
  locale text NOT NULL DEFAULT 'en'
    CHECK (locale ~ '^[a-z]{2,3}(-[A-Z]{2})?$'),
  theme_mode text NOT NULL DEFAULT 'system'
    CHECK (theme_mode IN ('system', 'light', 'dark')),
  default_model text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
