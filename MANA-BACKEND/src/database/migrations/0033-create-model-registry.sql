CREATE TABLE IF NOT EXISTS model_registry (
  model_id text PRIMARY KEY CHECK (char_length(model_id) BETWEEN 1 AND 128),
  provider text NOT NULL CHECK (char_length(provider) BETWEEN 1 AND 64),
  display_name text NOT NULL CHECK (char_length(display_name) BETWEEN 1 AND 160),
  capabilities jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(capabilities) = 'object'),
  context_window integer CHECK (context_window IS NULL OR context_window > 0),
  is_active boolean NOT NULL DEFAULT false,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS model_registry_provider_active_idx
  ON model_registry (provider, model_id) WHERE is_active;
