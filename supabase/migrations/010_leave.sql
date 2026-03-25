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
