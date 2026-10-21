CREATE TABLE IF NOT EXISTS conversation_folders (
  id uuid PRIMARY KEY,
  owner_subject text NOT NULL,
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 40),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS conversation_folders_owner_name_idx
  ON conversation_folders (owner_subject, lower(name));

ALTER TABLE conversations
  ADD COLUMN IF NOT EXISTS folder_id uuid
    REFERENCES conversation_folders(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS pinned_at timestamptz;

CREATE INDEX IF NOT EXISTS conversations_owner_pinned_updated_idx
  ON conversations (owner_subject, pinned_at DESC, updated_at DESC, id DESC)
  WHERE archived_at IS NULL;

CREATE INDEX IF NOT EXISTS conversations_folder_updated_idx
  ON conversations (folder_id, updated_at DESC, id DESC)
  WHERE archived_at IS NULL;
