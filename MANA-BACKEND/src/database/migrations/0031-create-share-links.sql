CREATE TABLE IF NOT EXISTS share_links (
  id uuid PRIMARY KEY,
  resource_type text NOT NULL CHECK (resource_type IN ('conversation', 'canvas_document')),
  resource_id uuid NOT NULL,
  owner_subject text NOT NULL REFERENCES users(subject) ON DELETE CASCADE,
  token_hash char(64) NOT NULL UNIQUE CHECK (token_hash ~ '^[a-f0-9]{64}$'),
  permission text NOT NULL DEFAULT 'read' CHECK (permission IN ('read', 'comment')),
  expires_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS share_links_owner_idx ON share_links (owner_subject, created_at DESC);
CREATE INDEX IF NOT EXISTS share_links_resource_idx
  ON share_links (resource_type, resource_id) WHERE revoked_at IS NULL;
