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
