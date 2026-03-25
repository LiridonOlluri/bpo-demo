-- 013: Audit Log (idempotent)
CREATE TABLE IF NOT EXISTS audit_log (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references user_profiles(id),
  action text not null,
  table_name text,
  record_id uuid,
  old_values jsonb,
  new_values jsonb,
  ip_address inet,
  created_at timestamptz default now()
);

CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_log(user_id, created_at desc);
CREATE INDEX IF NOT EXISTS idx_audit_table_record ON audit_log(table_name, record_id);

ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "ops_read_audit" ON audit_log;
CREATE POLICY "ops_read_audit" ON audit_log FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_profiles up JOIN roles r ON up.role_id = r.id
          WHERE up.id = auth.uid() AND r.level::text::int >= 4)
);
