INSERT INTO prompt_templates (
  id, template_key, locale, version, name, body, variables, is_active
)
VALUES (
  '5d1374bb-c1d9-47ea-831f-cbe2ccf44602',
  'assistant.default',
  'en',
  1,
  'Default assistant',
  'You are a helpful assistant. Be accurate, clear, and respectful.',
  '[]'::jsonb,
  true
)
ON CONFLICT (template_key, locale, version) DO NOTHING;
