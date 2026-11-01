CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY,
  user_subject text REFERENCES users(subject) ON DELETE SET NULL,
  conversation_id uuid REFERENCES conversations(id) ON DELETE SET NULL,
  message_id uuid REFERENCES messages(id) ON DELETE SET NULL,
  rating smallint CHECK (rating IS NULL OR rating BETWEEN 1 AND 5),
  category text CHECK (category IS NULL OR char_length(category) <= 80),
  comment text CHECK (comment IS NULL OR char_length(comment) <= 10000),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS feedback_recent_idx ON feedback (created_at DESC);
