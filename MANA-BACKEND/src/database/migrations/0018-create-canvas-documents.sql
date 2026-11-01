CREATE TABLE IF NOT EXISTS canvas_documents (
  id uuid PRIMARY KEY,
  owner_subject text NOT NULL REFERENCES users(subject) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 255),
  content text NOT NULL DEFAULT '',
  content_type text NOT NULL DEFAULT 'text/markdown'
    CHECK (content_type IN ('text/markdown', 'text/plain', 'application/json')),
  latest_version integer NOT NULL DEFAULT 0 CHECK (latest_version >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);
CREATE INDEX IF NOT EXISTS canvas_documents_owner_recent_idx
  ON canvas_documents (owner_subject, updated_at DESC) WHERE deleted_at IS NULL;
