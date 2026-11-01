CREATE TABLE IF NOT EXISTS assistants (
  id uuid PRIMARY KEY,
  owner_subject text NOT NULL REFERENCES users(subject) ON DELETE CASCADE,
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 120),
  description text NOT NULL DEFAULT '' CHECK (char_length(description) <= 2000),
  model_id text NOT NULL CHECK (char_length(model_id) BETWEEN 1 AND 128),
  instructions text NOT NULL DEFAULT '' CHECK (char_length(instructions) <= 100000),
  tools jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(tools) = 'array'),
  visibility text NOT NULL DEFAULT 'private' CHECK (visibility IN ('private', 'unlisted', 'public')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);
CREATE INDEX IF NOT EXISTS assistants_owner_recent_idx
  ON assistants (owner_subject, updated_at DESC) WHERE deleted_at IS NULL;
