-- 007: Attendance (idempotent)
CREATE TABLE IF NOT EXISTS attendance_events (
  id uuid primary key default uuid_generate_v4(),
  agent_id uuid references agents(id) on delete cascade,
  work_date date not null,
  scheduled_start time,
  scheduled_end time,
  actual_clock_in timestamptz,
  actual_clock_out timestamptz,
  status attendance_status not null default 'not-started',
  tardiness_minutes integer not null default 0,
  early_departure_minutes integer not null default 0,
  overtime_minutes integer not null default 0,
  break_overrun_minutes integer not null default 0,
  current_aux_code aux_code default 'ready',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(agent_id, work_date)
);

CREATE TABLE IF NOT EXISTS aux_history (
  id uuid primary key default uuid_generate_v4(),
  agent_id uuid references agents(id) on delete cascade,
  attendance_event_id uuid references attendance_events(id) on delete cascade,
  aux_code aux_code not null,
  started_at timestamptz not null,
  ended_at timestamptz,
  duration_minutes integer,
  work_date date not null,
  created_at timestamptz default now()
);

CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance_events(work_date);
CREATE INDEX IF NOT EXISTS idx_attendance_agent_date ON attendance_events(agent_id, work_date);
CREATE INDEX IF NOT EXISTS idx_aux_agent_date ON aux_history(agent_id, work_date);

ALTER TABLE attendance_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "agent_read_own" ON attendance_events;
CREATE POLICY "agent_read_own" ON attendance_events FOR SELECT USING (
  agent_id IN (SELECT id FROM agents WHERE user_profile_id = auth.uid())
);
DROP POLICY IF EXISTS "tl_read_team" ON attendance_events;
CREATE POLICY "tl_read_team" ON attendance_events FOR SELECT USING (
  agent_id IN (SELECT a.id FROM agents a WHERE a.team_lead_id = auth.uid())
);
DROP POLICY IF EXISTS "ops_read_all" ON attendance_events;
CREATE POLICY "ops_read_all" ON attendance_events FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_profiles up JOIN roles r ON up.role_id = r.id
          WHERE up.id = auth.uid() AND r.level::text::int >= 3)
);
DROP POLICY IF EXISTS "ops_write_all" ON attendance_events;
CREATE POLICY "ops_write_all" ON attendance_events FOR ALL USING (
  EXISTS (SELECT 1 FROM user_profiles up JOIN roles r ON up.role_id = r.id
          WHERE up.id = auth.uid() AND r.level::text::int >= 2)
);

ALTER TABLE aux_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tl_plus_read_aux" ON aux_history;
CREATE POLICY "tl_plus_read_aux" ON aux_history FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_profiles up JOIN roles r ON up.role_id = r.id
          WHERE up.id = auth.uid() AND r.level::text::int >= 2)
);
DROP POLICY IF EXISTS "ops_write_aux" ON aux_history;
CREATE POLICY "ops_write_aux" ON aux_history FOR ALL USING (
  EXISTS (SELECT 1 FROM user_profiles up JOIN roles r ON up.role_id = r.id
          WHERE up.id = auth.uid() AND r.level::text::int >= 2)
);
