CREATE TABLE IF NOT EXISTS user_preferences (
  owner_subject text PRIMARY KEY CHECK (char_length(owner_subject) BETWEEN 1 AND 255),
  locale text NOT NULL DEFAULT 'en' CHECK (locale ~ '^[a-z]{2,3}(-[A-Z]{2})?$'),
  theme_mode text NOT NULL DEFAULT 'system' CHECK (theme_mode IN ('system', 'light', 'dark')),
  default_model text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO users (subject)
SELECT DISTINCT owner_subject FROM user_preferences
WHERE owner_subject IS NOT NULL AND btrim(owner_subject) <> ''
ON CONFLICT (subject) DO NOTHING;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_preferences_owner_subject_users_fk') THEN
    ALTER TABLE user_preferences ADD CONSTRAINT user_preferences_owner_subject_users_fk
      FOREIGN KEY (owner_subject) REFERENCES users(subject) ON DELETE CASCADE;
  END IF;
END $$;
