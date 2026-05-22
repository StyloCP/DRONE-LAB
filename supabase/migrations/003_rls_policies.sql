-- 003: Row Level Security policies
-- All DB access goes through Next.js API routes using service_role_key.
-- Browser clients use anon key — blocked here at RLS level.

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries    ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log   ENABLE ROW LEVEL SECURITY;

-- Anon: deny everything (browser never hits DB directly)
CREATE POLICY "deny_anon_appointments" ON appointments
  FOR ALL TO anon USING (false);

CREATE POLICY "deny_anon_inquiries" ON inquiries
  FOR ALL TO anon USING (false);

CREATE POLICY "deny_anon_audit" ON audit_log
  FOR ALL TO anon USING (false);

-- Authenticated (admin): full access
CREATE POLICY "admin_all_appointments" ON appointments
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "admin_all_inquiries" ON inquiries
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "admin_all_audit" ON audit_log
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
