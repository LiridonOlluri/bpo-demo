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
