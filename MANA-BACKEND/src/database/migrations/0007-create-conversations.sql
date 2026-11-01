CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY,
  owner_subject text NOT NULL CHECK (char_length(owner_subject) BETWEEN 1 AND 255),
  title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 120),
  model text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  archived_at timestamptz,
  folder_id uuid,
  pinned_at timestamptz
);

CREATE TABLE IF NOT EXISTS conversation_folders (
  id uuid PRIMARY KEY,
  owner_subject text NOT NULL CHECK (char_length(owner_subject) BETWEEN 1 AND 255),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 40),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS conversation_folders_owner_name_idx
  ON conversation_folders (owner_subject, lower(name));
CREATE INDEX IF NOT EXISTS conversations_owner_updated_idx
  ON conversations (owner_subject, updated_at DESC, id DESC) WHERE archived_at IS NULL;
CREATE INDEX IF NOT EXISTS conversations_owner_pinned_updated_idx
  ON conversations (owner_subject, pinned_at DESC, updated_at DESC, id DESC) WHERE archived_at IS NULL;
CREATE INDEX IF NOT EXISTS conversations_folder_updated_idx
  ON conversations (folder_id, updated_at DESC, id DESC) WHERE archived_at IS NULL;

INSERT INTO users (subject)
SELECT DISTINCT owner_subject FROM conversations
WHERE owner_subject IS NOT NULL AND btrim(owner_subject) <> ''
ON CONFLICT (subject) DO NOTHING;

ALTER TABLE conversations
  ADD COLUMN IF NOT EXISTS user_subject text;
UPDATE conversations SET user_subject = owner_subject WHERE user_subject IS NULL;
ALTER TABLE conversations ALTER COLUMN user_subject SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'conversations_user_subject_fk') THEN
    ALTER TABLE conversations ADD CONSTRAINT conversations_user_subject_fk
      FOREIGN KEY (user_subject) REFERENCES users(subject) ON DELETE RESTRICT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'conversations_folder_id_fkey') THEN
    ALTER TABLE conversations ADD CONSTRAINT conversations_folder_id_fkey
      FOREIGN KEY (folder_id) REFERENCES conversation_folders(id) ON DELETE SET NULL;
  END IF;
END $$;
