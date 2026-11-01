INSERT INTO model_registry (
  model_id, provider, display_name, capabilities, context_window, is_active
)
VALUES (
  'gpt-4o-mini',
  'openai-compatible',
  'GPT-4o mini',
  '{"chat": true, "streaming": true}'::jsonb,
  NULL,
  true
)
ON CONFLICT (model_id) DO NOTHING;
