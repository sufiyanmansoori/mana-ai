INSERT INTO plans (plan_key, display_name, description, limits, is_active)
VALUES ('free', 'Free', 'Default plan; quotas are configured separately.', '{}'::jsonb, true)
ON CONFLICT (plan_key) DO NOTHING;
