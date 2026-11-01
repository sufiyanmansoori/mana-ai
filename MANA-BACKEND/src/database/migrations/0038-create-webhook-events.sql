CREATE TABLE IF NOT EXISTS webhook_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  provider text NOT NULL CHECK (char_length(provider) BETWEEN 1 AND 64),
  provider_event_id text NOT NULL CHECK (char_length(provider_event_id) BETWEEN 1 AND 255),
  event_type text NOT NULL CHECK (char_length(event_type) BETWEEN 1 AND 128),
  payload jsonb NOT NULL CHECK (jsonb_typeof(payload) = 'object'),
  status text NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'processing', 'processed', 'failed')),
  received_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz,
  last_error text,
  UNIQUE (provider, provider_event_id)
);
CREATE INDEX IF NOT EXISTS webhook_events_pending_idx
  ON webhook_events (received_at) WHERE status IN ('received', 'failed');
