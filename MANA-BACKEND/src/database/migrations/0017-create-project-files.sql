CREATE TABLE IF NOT EXISTS project_files (
  id uuid PRIMARY KEY,
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  path text NOT NULL CHECK (char_length(path) BETWEEN 1 AND 1024),
  storage_key text NOT NULL CHECK (char_length(storage_key) BETWEEN 1 AND 1024),
  mime_type text NOT NULL CHECK (char_length(mime_type) BETWEEN 1 AND 255),
  size_bytes bigint NOT NULL CHECK (size_bytes BETWEEN 0 AND 1073741824),
  sha256 char(64) CHECK (sha256 IS NULL OR sha256 ~ '^[a-f0-9]{64}$'),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz,
  UNIQUE (project_id, path)
);
CREATE INDEX IF NOT EXISTS project_files_project_recent_idx
  ON project_files (project_id, updated_at DESC) WHERE deleted_at IS NULL;
