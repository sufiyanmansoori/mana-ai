CREATE TABLE IF NOT EXISTS canvas_versions (
  id uuid PRIMARY KEY,
  document_id uuid NOT NULL REFERENCES canvas_documents(id) ON DELETE CASCADE,
  version integer NOT NULL CHECK (version >= 1),
  content text NOT NULL,
  created_by text NOT NULL REFERENCES users(subject) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (document_id, version)
);
CREATE INDEX IF NOT EXISTS canvas_versions_document_recent_idx
  ON canvas_versions (document_id, version DESC);
