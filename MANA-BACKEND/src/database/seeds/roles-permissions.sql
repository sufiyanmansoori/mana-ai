INSERT INTO roles (role_key, description, is_system)
VALUES
  ('user', 'Standard authenticated account', true),
  ('admin', 'Administrative access granted through trusted provisioning', true)
ON CONFLICT (role_key) DO NOTHING;

INSERT INTO permissions (permission_key, description)
VALUES
  ('conversation:read:own', 'Read conversations owned by the user'),
  ('conversation:write:own', 'Create and update conversations owned by the user'),
  ('image:generate', 'Request image generation'),
  ('preferences:read:own', 'Read own preferences'),
  ('preferences:write:own', 'Update own preferences'),
  ('admin:feature-flags:manage', 'Manage administrative feature flags'),
  ('admin:records:manage', 'Manage administrative records')
ON CONFLICT (permission_key) DO NOTHING;

INSERT INTO role_permissions (role_key, permission_key)
SELECT 'user', permission_key
FROM permissions
WHERE permission_key IN (
  'conversation:read:own',
  'conversation:write:own',
  'image:generate',
  'preferences:read:own',
  'preferences:write:own'
)
ON CONFLICT (role_key, permission_key) DO NOTHING;

INSERT INTO role_permissions (role_key, permission_key)
SELECT 'admin', permission_key FROM permissions
ON CONFLICT (role_key, permission_key) DO NOTHING;
