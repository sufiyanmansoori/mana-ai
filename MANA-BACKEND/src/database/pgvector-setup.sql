-- Optional and explicitly provisioned. Verify extension availability and the
-- database role's privileges before running in a deployment environment.
CREATE EXTENSION IF NOT EXISTS vector;

ALTER TABLE document_embeddings
  ADD COLUMN IF NOT EXISTS embedding_vector vector;

COMMENT ON COLUMN document_embeddings.embedding_vector IS
  'Optional pgvector representation; populate only after selecting and validating the embedding model and dimensions.';
