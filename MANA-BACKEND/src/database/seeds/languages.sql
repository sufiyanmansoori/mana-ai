INSERT INTO languages (locale, display_name, is_enabled)
VALUES
  ('en', 'English', true),
  ('hi', 'Hindi', true)
ON CONFLICT (locale) DO NOTHING;
