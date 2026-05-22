-- 002: Create inquiries and audit_log tables
CREATE TABLE IF NOT EXISTS inquiries (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  personal_id text,
  email       text NOT NULL,
  unit        text,
  type        text NOT NULL,
  content     text NOT NULL,
  status      text NOT NULL DEFAULT 'לא נענה'
                CHECK (status IN ('לא נענה', 'בטיפול', 'טופל')),
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);

CREATE TABLE IF NOT EXISTS audit_log (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action      text NOT NULL,
  target_id   uuid,
  admin_email text,
  ip_address  text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_log(created_at DESC);
