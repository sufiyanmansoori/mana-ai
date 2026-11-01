CREATE TABLE IF NOT EXISTS prompt_templates (
  id uuid PRIMARY KEY,
  template_key text NOT NULL UNIQUE CHECK (template_key ~ '^[a-z][a-z0-9_.-]{1,127}$'),
  locale text NOT NULL DEFAULT 'en' CHECK (locale ~ '^[a-z]{2,3}(?:-[A-Z]{2})?$'),
  version integer NOT NULL CHECK (version >= 1),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 160),
  body text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 100000),
  variables jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(variables) = 'array'),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (template_key, locale, version)
);
CREATE INDEX IF NOT EXISTS prompt_templates_active_idx
  ON prompt_templates (template_key, locale, version DESC) WHERE is_active;
