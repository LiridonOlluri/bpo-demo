-- 012: Overtime Requests (idempotent)
CREATE TABLE IF NOT EXISTS overtime_requests (
  id uuid primary key default uuid_generate_v4(),
  agent_id uuid references agents(id),
  client_id uuid references clients(id),
  work_date date not null,
  start_time time not null,
  end_time time not null,
  hours numeric(4,2) not null,
  rate_multiplier numeric(4,2) not null default 1.5,
  cost numeric(10,2) not null,
  status text not null default 'pending',
  offered_at timestamptz default now(),
  responded_at timestamptz,
  approved_by uuid references user_profiles(id),
  reason text,
  sla_penalty_risk numeric(10,2),
  created_at timestamptz default now()
);

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE overtime_requests;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

ALTER TABLE overtime_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "agent_read_own_ot" ON overtime_requests;
CREATE POLICY "agent_read_own_ot" ON overtime_requests FOR SELECT USING (
  agent_id IN (SELECT id FROM agents WHERE user_profile_id = auth.uid())
);
DROP POLICY IF EXISTS "ops_manage_ot" ON overtime_requests;
CREATE POLICY "ops_manage_ot" ON overtime_requests FOR ALL USING (
  EXISTS (SELECT 1 FROM user_profiles up JOIN roles r ON up.role_id = r.id
          WHERE up.id = auth.uid() AND r.level::text::int >= 2)
);
