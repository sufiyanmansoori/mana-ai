CREATE TABLE IF NOT EXISTS event_outbox (
  event_id uuid PRIMARY KEY,
  event_name text NOT NULL CHECK (char_length(event_name) BETWEEN 1 AND 160),
  payload jsonb NOT NULL CHECK (jsonb_typeof(payload) = 'object'),
  occurred_at timestamptz NOT NULL DEFAULT now(),
  available_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz,
  attempts integer NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  last_error text
);
CREATE INDEX IF NOT EXISTS event_outbox_pending_idx
  ON event_outbox (available_at, occurred_at) WHERE published_at IS NULL;
