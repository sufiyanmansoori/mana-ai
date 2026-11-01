DO $$
DECLARE
  admin_subject text := nullif(current_setting('mana.seed_admin_subject', true), '');
BEGIN
  IF admin_subject IS NULL THEN
    RAISE EXCEPTION 'Set the session parameter mana.seed_admin_subject explicitly before running this seed';
  END IF;

  INSERT INTO users (subject) VALUES (admin_subject)
  ON CONFLICT (subject) DO NOTHING;

  INSERT INTO user_roles (user_subject, role_key)
  VALUES (admin_subject, 'admin')
  ON CONFLICT (user_subject, role_key) DO NOTHING;
END $$;
