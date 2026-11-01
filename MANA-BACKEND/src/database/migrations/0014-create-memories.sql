CREATE TABLE IF NOT EXISTS user_memories (
  id uuid PRIMARY KEY,
  user_subject text NOT NULL REFERENCES users(subject) ON DELETE CASCADE,
  memory_key text NOT NULL CHECK (char_length(memory_key) BETWEEN 1 AND 128),
  content text NOT NULL CHECK (char_length(content) BETWEEN 1 AND 10000),
  source_conversation_id uuid REFERENCES conversations(id) ON DELETE SET NULL,
  confidence numeric(4, 3) CHECK (confidence IS NULL OR confidence BETWEEN 0 AND 1),
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_subject, memory_key)
);
CREATE INDEX IF NOT EXISTS user_memories_user_recent_idx
  ON user_memories (user_subject, updated_at DESC);
