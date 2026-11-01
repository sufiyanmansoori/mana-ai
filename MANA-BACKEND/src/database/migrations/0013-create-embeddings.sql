CREATE TABLE IF NOT EXISTS document_embeddings (
  id uuid PRIMARY KEY,
  chunk_id uuid NOT NULL REFERENCES document_chunks(id) ON DELETE CASCADE,
  model_id text NOT NULL CHECK (char_length(model_id) BETWEEN 1 AND 128),
  dimensions integer NOT NULL CHECK (dimensions BETWEEN 1 AND 16000),
  embedding jsonb NOT NULL CHECK (jsonb_typeof(embedding) = 'array'),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (chunk_id, model_id)
);
CREATE INDEX IF NOT EXISTS document_embeddings_model_idx ON document_embeddings (model_id, dimensions);
