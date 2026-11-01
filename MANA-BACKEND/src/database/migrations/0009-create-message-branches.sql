CREATE TABLE IF NOT EXISTS message_branches (
  id uuid PRIMARY KEY,
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  parent_message_id uuid REFERENCES messages(id) ON DELETE SET NULL,
  selected_message_id uuid REFERENCES messages(id) ON DELETE SET NULL,
  branch_name text NOT NULL DEFAULT 'main' CHECK (char_length(branch_name) BETWEEN 1 AND 120),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (conversation_id, branch_name)
);
CREATE INDEX IF NOT EXISTS message_branches_conversation_updated_idx
  ON message_branches (conversation_id, updated_at DESC);
