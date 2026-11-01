CREATE TABLE IF NOT EXISTS audit_logs (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  actor_subject text REFERENCES users(subject) ON DELETE SET NULL,
  action text NOT NULL CHECK (char_length(action) BETWEEN 1 AND 128),
  resource_type text NOT NULL CHECK (char_length(resource_type) BETWEEN 1 AND 128),
  resource_id text CHECK (resource_id IS NULL OR char_length(resource_id) <= 255),
  request_id text CHECK (request_id IS NULL OR char_length(request_id) <= 128),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(metadata) = 'object'),
  occurred_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS audit_logs_actor_recent_idx ON audit_logs (actor_subject, occurred_at DESC);
CREATE INDEX IF NOT EXISTS audit_logs_resource_recent_idx
  ON audit_logs (resource_type, resource_id, occurred_at DESC);
