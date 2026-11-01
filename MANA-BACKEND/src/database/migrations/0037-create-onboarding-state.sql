CREATE TABLE IF NOT EXISTS onboarding_state (
  user_subject text PRIMARY KEY REFERENCES users(subject) ON DELETE CASCADE,
  current_step text NOT NULL DEFAULT 'welcome' CHECK (char_length(current_step) BETWEEN 1 AND 80),
  completed_steps jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(completed_steps) = 'array'),
  completed_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);
