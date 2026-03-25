-- 001: Extensions & Enums (idempotent)
create extension if not exists "uuid-ossp";

DO $$ BEGIN CREATE TYPE access_level AS ENUM ('1','2','3','4','5'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE channel_type AS ENUM ('voice','chat','email','back-office'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE billing_model AS ENUM ('per-minute','per-fte','fixed','hybrid'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE attendance_status AS ENUM ('on-time','late','absent','ncns','on-leave','not-started'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE aux_code AS ENUM ('ready','on-call','wrap-up','break','lunch','meeting','coaching','training','personal','system-down','project'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE leave_type AS ENUM ('paid','unpaid','sick','training','maternity','bereavement'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE leave_request_status AS ENUM ('pending','approved','blocked','cancelled'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE ticket_priority AS ENUM ('low','medium','high','critical'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE ticket_status AS ENUM ('open','acknowledged','action-taken','follow-up','resolved','recurring'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE shift_type AS ENUM ('early','mid','late','custom'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE agent_status AS ENUM ('active','on-leave','terminated','onboarding'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE ramp_phase AS ENUM ('classroom','nesting','guided','production'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE shrinkage_type AS ENUM ('planned','unplanned'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE shrinkage_scope AS ENUM ('internal','external'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE bradford_threshold AS ENUM ('green','amber','red','critical'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE ticket_action_category AS ENUM ('coaching','schedule-adjustment','agent-reassignment','hr-escalation','it-ticket','other'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE follow_up_result AS ENUM ('improved','not-improved','pending'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE leave_week_status AS ENUM ('green','amber','red'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE fte_trend AS ENUM ('improving','stable','worsening'); EXCEPTION WHEN duplicate_object THEN null; END $$;
-- 002: Roles & Users (idempotent)
CREATE TABLE IF NOT EXISTS roles (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  level access_level not null,
  modules text[] not null default '{}',
  permissions jsonb not null default '{}',
  created_at timestamptz default now()
);

INSERT INTO roles (name, level, modules, permissions) VALUES
  ('Agent Associate', '1', array['attendance','payroll','leave','training'],
    '{"attendance":["view"],"payroll":["view"],"leave":["view","edit"],"training":["view"]}'),
  ('Team Lead', '2', array['attendance','workforce','performance','quality','leave','payroll'],
    '{"attendance":["view","edit"],"workforce":["view"],"performance":["view","edit"],"quality":["view","edit"],"leave":["view","approve"],"payroll":["view"]}'),
  ('Account Manager', '3', array['clients','billing','performance','quality'],
    '{"clients":["view","edit"],"billing":["view","edit"],"performance":["view"],"quality":["view"]}'),
  ('Operations Manager', '3', array['attendance','workforce','performance','quality','leave','payroll','hr','clients','compliance'],
    '{"attendance":["view","edit","approve"],"workforce":["view","edit","approve"],"performance":["view","edit","approve"],"leave":["view","edit","approve"],"payroll":["view","approve"],"hr":["view","edit"]}'),
  ('Executive', '5', array['overview','clients','workforce','attendance','performance','quality','payroll','billing','hr','compliance','training','settings'],
    '{"*":["view","edit","approve","admin"]}')
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  role_id uuid references roles(id),
  team_id uuid,
  manager_id uuid references user_profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "users_read_own" ON user_profiles;
CREATE POLICY "users_read_own" ON user_profiles FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "managers_read_team" ON user_profiles;
CREATE POLICY "managers_read_team" ON user_profiles FOR SELECT
  USING (manager_id = auth.uid() OR id = auth.uid());
DROP POLICY IF EXISTS "admin_all" ON user_profiles;
CREATE POLICY "admin_all" ON user_profiles FOR ALL
  USING (EXISTS (SELECT 1 FROM user_profiles up JOIN roles r ON up.role_id = r.id
                 WHERE up.id = auth.uid() AND r.level IN ('4','5')));
-- 003: Teams & Agents (idempotent)
CREATE TABLE IF NOT EXISTS teams (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  team_lead_id uuid references user_profiles(id),
  created_at timestamptz default now()
);

CREATE TABLE IF NOT EXISTS agents (
  id uuid primary key default uuid_generate_v4(),
  user_profile_id uuid references user_profiles(id) on delete cascade,
  team_id uuid references teams(id),
  team_lead_id uuid references user_profiles(id),
  client_id uuid,
  channel channel_type not null,
  contract_type text not null default 'fixed-6m',
  contract_start date not null,
  contract_end date,
  probation_end date,
  salary numeric(10,2) not null default 800.00,
  overtime_rate numeric(4,2) not null default 1.5,
  night_differential numeric(4,2) not null default 0.15,
  certifications text[] default '{}',
  leave_entitlement integer not null default 20,
  leave_used integer not null default 0,
  ramp_phase ramp_phase,
  ramp_efficiency numeric(3,2) default 1.0,
  bradford_score integer not null default 0,
  status agent_status not null default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

DO $$ BEGIN
  ALTER TABLE agents ADD COLUMN leave_remaining integer
    GENERATED ALWAYS AS (leave_entitlement - leave_used) STORED;
EXCEPTION WHEN duplicate_column THEN null;
END $$;

ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "agents_read_own" ON agents;
CREATE POLICY "agents_read_own" ON agents FOR SELECT
  USING (user_profile_id = auth.uid());
DROP POLICY IF EXISTS "tl_read_team" ON agents;
CREATE POLICY "tl_read_team" ON agents FOR SELECT
  USING (team_lead_id = auth.uid());
DROP POLICY IF EXISTS "ops_read_all" ON agents;
CREATE POLICY "ops_read_all" ON agents FOR SELECT
  USING (EXISTS (SELECT 1 FROM user_profiles up JOIN roles r ON up.role_id = r.id
                 WHERE up.id = auth.uid() AND r.level::text::int >= 3));
DROP POLICY IF EXISTS "ops_write" ON agents;
CREATE POLICY "ops_write" ON agents FOR ALL
  USING (EXISTS (SELECT 1 FROM user_profiles up JOIN roles r ON up.role_id = r.id
                 WHERE up.id = auth.uid() AND r.level::text::int >= 3));
-- 004: Clients (idempotent)
CREATE TABLE IF NOT EXISTS clients (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  industry text not null,
  channel channel_type not null,
  agents_assigned integer not null default 0,
  sla_percentage numeric(5,2) not null,
  sla_seconds integer not null,
  aht_target integer not null,
  acw_target integer not null,
  daily_volume integer not null,
  peak_hours text[] default '{}',
  occupancy_target numeric(4,2) not null default 0.80,
  occupancy_cap numeric(4,2) not null default 0.88,
  chat_concurrency integer,
  required_certifications text[] default '{}',
  billing_model billing_model not null,
  operating_hours_start time not null default '07:00',
  operating_hours_end time not null default '22:00',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

DO $$ BEGIN
  ALTER TABLE teams ADD COLUMN client_id uuid REFERENCES clients(id);
EXCEPTION WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE agents ADD CONSTRAINT fk_agents_client FOREIGN KEY (client_id) REFERENCES clients(id);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tl_plus_read" ON clients;
CREATE POLICY "tl_plus_read" ON clients FOR SELECT
  USING (EXISTS (SELECT 1 FROM user_profiles up JOIN roles r ON up.role_id = r.id
                 WHERE up.id = auth.uid() AND r.level::text::int >= 2));
DROP POLICY IF EXISTS "ops_plus_write" ON clients;
CREATE POLICY "ops_plus_write" ON clients FOR ALL
  USING (EXISTS (SELECT 1 FROM user_profiles up JOIN roles r ON up.role_id = r.id
                 WHERE up.id = auth.uid() AND r.level::text::int >= 3));
-- 005: Shrinkage Configuration (idempotent)
CREATE TABLE IF NOT EXISTS shrinkage_categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  type shrinkage_type not null,
  scope shrinkage_scope not null,
  percentage numeric(5,2) not null,
  minutes_per_day integer not null default 0,
  is_moveable boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz default now()
);

INSERT INTO shrinkage_categories (name, type, scope, percentage, minutes_per_day, is_moveable, sort_order) VALUES
  ('Paid Breaks (2 x 15 min)', 'planned', 'internal', 6.3, 30, true, 1),
  ('Team Meetings / Huddles', 'planned', 'internal', 2.1, 10, true, 2),
  ('One-on-One Coaching', 'planned', 'internal', 1.6, 8, true, 3),
  ('Training Sessions', 'planned', 'internal', 2.1, 10, true, 4),
  ('QA Calibration / Feedback', 'planned', 'internal', 0.8, 4, true, 5),
  ('Annual Leave / Vacation', 'planned', 'external', 5.0, 0, false, 6),
  ('Public Holidays', 'planned', 'external', 2.1, 0, false, 7),
  ('Planned Leave Buffer', 'planned', 'external', 1.0, 0, false, 8),
  ('Sick Leave', 'unplanned', 'external', 3.5, 0, false, 9),
  ('Tardiness / Late Arrivals', 'unplanned', 'external', 1.0, 0, false, 10),
  ('Early Departures', 'unplanned', 'external', 0.5, 0, false, 11),
  ('No-Call-No-Show', 'unplanned', 'external', 0.5, 0, false, 12),
  ('Extended Breaks (overruns)', 'unplanned', 'internal', 1.0, 0, false, 13),
  ('Unscheduled Personal Time', 'unplanned', 'internal', 1.0, 0, false, 14),
  ('System Downtime', 'unplanned', 'internal', 1.0, 0, false, 15),
  ('Special Projects / Back-Office', 'unplanned', 'internal', 0.5, 0, false, 16)
ON CONFLICT (name) DO NOTHING;

ALTER TABLE shrinkage_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth_read" ON shrinkage_categories;
CREATE POLICY "auth_read" ON shrinkage_categories FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "admin_write" ON shrinkage_categories;
CREATE POLICY "admin_write" ON shrinkage_categories FOR ALL
  USING (EXISTS (SELECT 1 FROM user_profiles up JOIN roles r ON up.role_id = r.id
                 WHERE up.id = auth.uid() AND r.level::text::int >= 4));
-- 006: Shifts & Schedules (idempotent)
CREATE TABLE IF NOT EXISTS shifts (
  id uuid primary key default uuid_generate_v4(),
  type shift_type not null,
  name text not null unique,
  start_time time not null,
  end_time time not null,
  created_at timestamptz default now()
);

CREATE TABLE IF NOT EXISTS shift_breaks (
  id uuid primary key default uuid_generate_v4(),
  shift_id uuid references shifts(id) on delete cascade,
  break_start time not null,
  break_end time not null,
  break_type text not null,
  is_moveable boolean not null default true,
  created_at timestamptz default now()
);

INSERT INTO shifts (type, name, start_time, end_time) VALUES
  ('early', 'Early Shift', '07:00', '15:00'),
  ('mid',   'Mid Shift',   '10:00', '18:00'),
  ('late',  'Late Shift',  '16:00', '00:00')
ON CONFLICT (name) DO NOTHING;

CREATE TABLE IF NOT EXISTS agent_schedules (
  id uuid primary key default uuid_generate_v4(),
  agent_id uuid references agents(id) on delete cascade,
  shift_id uuid references shifts(id),
  work_date date not null,
  scheduled_start time not null,
  scheduled_end time not null,
  created_at timestamptz default now(),
  unique(agent_id, work_date)
);

CREATE TABLE IF NOT EXISTS schedule_intervals (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references clients(id),
  work_date date not null,
  interval_start time not null,
  interval_end time not null,
  required_agents integer not null,
  scheduled_agents integer not null default 0,
  volume_forecast integer not null default 0,
  erlang_traffic numeric(8,4),
  projected_sl numeric(5,4),
  projected_occupancy numeric(5,4),
  projected_asa integer,
  created_at timestamptz default now(),
  unique(client_id, work_date, interval_start)
);

ALTER TABLE schedule_intervals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tl_plus_read_intervals" ON schedule_intervals;
CREATE POLICY "tl_plus_read_intervals" ON schedule_intervals FOR SELECT
  USING (EXISTS (SELECT 1 FROM user_profiles up JOIN roles r ON up.role_id = r.id
                 WHERE up.id = auth.uid() AND r.level::text::int >= 2));
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
-- 008: Live Metrics (idempotent)
CREATE TABLE IF NOT EXISTS live_metrics_snapshots (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references clients(id),
  snapshot_at timestamptz not null default now(),
  interval_start time not null,
  service_level numeric(5,4),
  calls_in_queue integer,
  occupancy numeric(5,4),
  aht_current integer,
  aht_target integer,
  acw_current integer,
  acw_target integer,
  abandonment_rate numeric(5,4),
  asa integer,
  adherence numeric(5,4),
  agents_scheduled integer,
  agents_logged_in integer,
  shrinkage_planned numeric(5,4),
  shrinkage_actual numeric(5,4),
  volume_actual integer,
  created_at timestamptz default now()
);

CREATE INDEX IF NOT EXISTS idx_live_metrics_client_time ON live_metrics_snapshots(client_id, snapshot_at desc);

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE live_metrics_snapshots;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS fte_loss_snapshots (
  id uuid primary key default uuid_generate_v4(),
  team_id uuid references teams(id),
  snapshot_at timestamptz not null default now(),
  nominal_ftes numeric(6,2) not null,
  effective_ftes numeric(6,2) not null,
  total_loss numeric(6,2) not null,
  loss_percentage numeric(5,2) not null,
  daily_cost_impact numeric(10,2),
  monthly_cost_projection numeric(10,2),
  category_breakdown jsonb not null default '{}',
  client_attribution jsonb not null default '[]',
  trend fte_trend not null default 'stable',
  created_at timestamptz default now()
);

CREATE INDEX IF NOT EXISTS idx_fte_snapshots_team ON fte_loss_snapshots(team_id, snapshot_at desc);

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE fte_loss_snapshots;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

ALTER TABLE live_metrics_snapshots ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tl_plus_read_metrics" ON live_metrics_snapshots;
CREATE POLICY "tl_plus_read_metrics" ON live_metrics_snapshots FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_profiles up JOIN roles r ON up.role_id = r.id
          WHERE up.id = auth.uid() AND r.level::text::int >= 2)
);

ALTER TABLE fte_loss_snapshots ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tl_read_own_team" ON fte_loss_snapshots;
CREATE POLICY "tl_read_own_team" ON fte_loss_snapshots FOR SELECT USING (
  team_id IN (SELECT t.id FROM teams t WHERE t.team_lead_id = auth.uid())
  OR EXISTS (SELECT 1 FROM user_profiles up JOIN roles r ON up.role_id = r.id
             WHERE up.id = auth.uid() AND r.level::text::int >= 3)
);
-- 009: Productivity Tickets (idempotent)
CREATE TABLE IF NOT EXISTS productivity_tickets (
  id uuid primary key default uuid_generate_v4(),
  team_id uuid references teams(id),
  team_lead_id uuid references user_profiles(id),
  created_at timestamptz default now(),
  acknowledged_at timestamptz,
  resolved_at timestamptz,
  priority ticket_priority not null default 'medium',
  status ticket_status not null default 'open',
  trigger_description text not null,
  fte_loss_snapshot_id uuid references fte_loss_snapshots(id),
  root_cause_analysis text[] not null default '{}',
  suggested_actions text[] not null default '{}',
  action_taken text,
  action_category ticket_action_category,
  follow_up_date date,
  follow_up_result follow_up_result,
  is_recurring boolean not null default false,
  escalated_to uuid references user_profiles(id),
  updated_at timestamptz default now()
);

CREATE INDEX IF NOT EXISTS idx_tickets_team ON productivity_tickets(team_id, created_at desc);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON productivity_tickets(status);

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE productivity_tickets;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

ALTER TABLE productivity_tickets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tl_read_own_tickets" ON productivity_tickets;
CREATE POLICY "tl_read_own_tickets" ON productivity_tickets FOR SELECT USING (
  team_lead_id = auth.uid()
);
DROP POLICY IF EXISTS "tl_write_own" ON productivity_tickets;
CREATE POLICY "tl_write_own" ON productivity_tickets FOR UPDATE USING (
  team_lead_id = auth.uid()
);
DROP POLICY IF EXISTS "ops_plus_read_all" ON productivity_tickets;
CREATE POLICY "ops_plus_read_all" ON productivity_tickets FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_profiles up JOIN roles r ON up.role_id = r.id
          WHERE up.id = auth.uid() AND r.level::text::int >= 3)
);
DROP POLICY IF EXISTS "system_insert" ON productivity_tickets;
CREATE POLICY "system_insert" ON productivity_tickets FOR INSERT WITH CHECK (true);
-- 010: Leave Management (idempotent)
CREATE TABLE IF NOT EXISTS leave_requests (
  id uuid primary key default uuid_generate_v4(),
  agent_id uuid references agents(id) on delete cascade,
  type leave_type not null,
  start_date date not null,
  end_date date not null,
  days_requested integer not null,
  status leave_request_status not null default 'pending',
  block_reason text,
  alternative_dates date[],
  approved_by uuid references user_profiles(id),
  approved_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

CREATE TABLE IF NOT EXISTS leave_capacity_weeks (
  id uuid primary key default uuid_generate_v4(),
  week_number integer not null,
  start_date date not null,
  slots_available integer not null default 2,
  slots_used integer not null default 0,
  status leave_week_status not null default 'green',
  volume_forecast_delta numeric(5,2) default 0,
  smart_push_active boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(week_number, start_date)
);

CREATE TABLE IF NOT EXISTS bradford_entries (
  id uuid primary key default uuid_generate_v4(),
  agent_id uuid references agents(id) on delete cascade,
  spell_number integer not null,
  start_date date not null,
  end_date date not null,
  days integer not null,
  created_at timestamptz default now()
);

CREATE OR REPLACE VIEW bradford_scores AS
SELECT
  a.id AS agent_id,
  up.name AS agent_name,
  t.id AS team_id,
  count(be.id) AS spells,
  coalesce(sum(be.days), 0) AS total_days,
  (count(be.id) * count(be.id) * coalesce(sum(be.days), 0)) AS score,
  CASE
    WHEN (count(be.id) * count(be.id) * coalesce(sum(be.days), 0)) >= 650 THEN 'critical'::bradford_threshold
    WHEN (count(be.id) * count(be.id) * coalesce(sum(be.days), 0)) >= 400 THEN 'red'::bradford_threshold
    WHEN (count(be.id) * count(be.id) * coalesce(sum(be.days), 0)) >= 125 THEN 'amber'::bradford_threshold
    ELSE 'green'::bradford_threshold
  END AS threshold
FROM agents a
JOIN user_profiles up ON a.user_profile_id = up.id
JOIN teams t ON a.team_id = t.id
LEFT JOIN bradford_entries be ON be.agent_id = a.id
  AND be.start_date >= (current_date - interval '12 months')
GROUP BY a.id, up.name, t.id;

ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "agent_own_leave" ON leave_requests;
CREATE POLICY "agent_own_leave" ON leave_requests FOR SELECT USING (
  agent_id IN (SELECT id FROM agents WHERE user_profile_id = auth.uid())
);
DROP POLICY IF EXISTS "tl_team_leave" ON leave_requests;
CREATE POLICY "tl_team_leave" ON leave_requests FOR SELECT USING (
  agent_id IN (SELECT a.id FROM agents a WHERE a.team_lead_id = auth.uid())
);
DROP POLICY IF EXISTS "ops_all_leave" ON leave_requests;
CREATE POLICY "ops_all_leave" ON leave_requests FOR ALL USING (
  EXISTS (SELECT 1 FROM user_profiles up JOIN roles r ON up.role_id = r.id
          WHERE up.id = auth.uid() AND r.level::text::int >= 3)
);
DROP POLICY IF EXISTS "agent_insert_own" ON leave_requests;
CREATE POLICY "agent_insert_own" ON leave_requests FOR INSERT WITH CHECK (
  agent_id IN (SELECT id FROM agents WHERE user_profile_id = auth.uid())
);

ALTER TABLE leave_capacity_weeks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tl_plus_read_capacity" ON leave_capacity_weeks;
CREATE POLICY "tl_plus_read_capacity" ON leave_capacity_weeks FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_profiles up JOIN roles r ON up.role_id = r.id
          WHERE up.id = auth.uid() AND r.level::text::int >= 2)
);
-- 011: Payroll (idempotent)
CREATE TABLE IF NOT EXISTS payroll_lines (
  id uuid primary key default uuid_generate_v4(),
  agent_id uuid references agents(id),
  period text not null,
  base_hours numeric(6,2) not null default 0,
  overtime_hours numeric(6,2) not null default 0,
  overtime_rate numeric(4,2) not null default 1.5,
  overtime_cost numeric(10,2) not null default 0,
  night_diff_hours numeric(6,2) not null default 0,
  night_diff_premium numeric(4,2) not null default 0.15,
  night_diff_cost numeric(10,2) not null default 0,
  tardiness_deduction_minutes integer not null default 0,
  tardiness_deduction_amount numeric(10,2) not null default 0,
  paid_leave_days integer not null default 0,
  paid_leave_amount numeric(10,2) not null default 0,
  unpaid_leave_days integer not null default 0,
  attendance_bonus_eligible boolean not null default false,
  attendance_bonus_amount numeric(10,2) not null default 0,
  qa_bonus_eligible boolean not null default false,
  qa_bonus_amount numeric(10,2) not null default 0,
  gross_pay numeric(10,2) not null default 0,
  client_allocation jsonb not null default '[]',
  approved boolean not null default false,
  approved_by uuid references user_profiles(id),
  approved_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(agent_id, period)
);

CREATE INDEX IF NOT EXISTS idx_payroll_period ON payroll_lines(period);

ALTER TABLE payroll_lines ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "agent_read_own_payroll" ON payroll_lines;
CREATE POLICY "agent_read_own_payroll" ON payroll_lines FOR SELECT USING (
  agent_id IN (SELECT id FROM agents WHERE user_profile_id = auth.uid())
);
DROP POLICY IF EXISTS "ops_read_all_payroll" ON payroll_lines;
CREATE POLICY "ops_read_all_payroll" ON payroll_lines FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_profiles up JOIN roles r ON up.role_id = r.id
          WHERE up.id = auth.uid() AND r.level::text::int >= 3)
);
DROP POLICY IF EXISTS "ops_approve_payroll" ON payroll_lines;
CREATE POLICY "ops_approve_payroll" ON payroll_lines FOR UPDATE USING (
  EXISTS (SELECT 1 FROM user_profiles up JOIN roles r ON up.role_id = r.id
          WHERE up.id = auth.uid() AND r.level::text::int >= 3)
);
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
-- 014: Seed Data (idempotent)

-- Seed: 2 Clients
INSERT INTO clients (id, name, industry, channel, agents_assigned, sla_percentage, sla_seconds,
  aht_target, acw_target, daily_volume, peak_hours, occupancy_target, occupancy_cap,
  billing_model, operating_hours_start, operating_hours_end)
VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Client A', 'E-commerce', 'voice',
   35, 80.00, 20, 300, 45, 600, array['10:00-14:00','19:00-21:00'],
   0.80, 0.88, 'per-minute', '07:00', '22:00'),
  ('a1000000-0000-0000-0000-000000000002', 'Client B', 'Tech Support', 'chat',
   15, 90.00, 60, 480, 60, 400, array['09:00-12:00'],
   0.75, 0.85, 'per-fte', '08:00', '00:00')
ON CONFLICT (id) DO NOTHING;

-- Seed: 5 Teams
INSERT INTO teams (id, name, client_id) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'Team A', 'a1000000-0000-0000-0000-000000000001'),
  ('b1000000-0000-0000-0000-000000000002', 'Team B', 'a1000000-0000-0000-0000-000000000001'),
  ('b1000000-0000-0000-0000-000000000003', 'Team C', 'a1000000-0000-0000-0000-000000000001'),
  ('b1000000-0000-0000-0000-000000000004', 'Team D', 'a1000000-0000-0000-0000-000000000001'),
  ('b1000000-0000-0000-0000-000000000005', 'Team E', 'a1000000-0000-0000-0000-000000000002')
ON CONFLICT (id) DO NOTHING;

-- Seed: Pre-existing productivity ticket
INSERT INTO productivity_tickets (team_id, priority, status, trigger_description,
  root_cause_analysis, suggested_actions, action_taken, is_recurring)
SELECT
  'b1000000-0000-0000-0000-000000000002', 'high', 'recurring',
  'FTE Loss > 30% (occurred 3x this week)',
  array['AHT overrun: 2.7 FTE lost', 'Adherence: 1.07 FTE lost'],
  array['Coaching on new product', 'Monitor AUX codes'],
  'Coaching given but AHT not improved yet', true
WHERE NOT EXISTS (
  SELECT 1 FROM productivity_tickets
  WHERE team_id = 'b1000000-0000-0000-0000-000000000002'
    AND trigger_description = 'FTE Loss > 30% (occurred 3x this week)'
);

-- Seed: Leave capacity weeks
INSERT INTO leave_capacity_weeks (week_number, start_date, slots_available, slots_used, status, volume_forecast_delta)
SELECT
  extract(week FROM d)::int,
  d,
  CASE WHEN extract(week FROM d)::int % 4 = 0 THEN 1
       WHEN extract(week FROM d)::int % 3 = 0 THEN 3
       ELSE 2 END,
  0,
  CASE WHEN extract(week FROM d)::int % 4 = 0 THEN 'red'::leave_week_status
       WHEN extract(week FROM d)::int % 3 = 0 THEN 'green'::leave_week_status
       ELSE 'amber'::leave_week_status END,
  CASE WHEN extract(week FROM d)::int % 3 = 0 THEN -15.0
       ELSE 0.0 END
FROM generate_series(current_date, current_date + interval '90 days', interval '1 week') d
ON CONFLICT (week_number, start_date) DO NOTHING;
