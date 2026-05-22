-- 001: Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  personal_id text NOT NULL,
  unit        text NOT NULL,
  type        text NOT NULL,
  phone       text NOT NULL,
  date        date NOT NULL,
  slot        text NOT NULL,
  status      text NOT NULL DEFAULT 'ממתין'
                CHECK (status IN ('ממתין', 'מאושר', 'מבוטל')),
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE(date, slot)
);

-- Index for fast date queries
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
