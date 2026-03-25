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
