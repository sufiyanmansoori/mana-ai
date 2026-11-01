CREATE TABLE IF NOT EXISTS admin_records (
  id text PRIMARY KEY
    CHECK (char_length(id) BETWEEN 1 AND 128)
    CHECK (id !~ '[[:cntrl:]]'),
  created_at timestamptz NOT NULL
);

CREATE INDEX IF NOT EXISTS admin_records_created_at_id_idx
  ON admin_records (created_at DESC, id ASC);
