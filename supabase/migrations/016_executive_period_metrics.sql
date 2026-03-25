-- Executive KPI snapshots (demo) — seeded in 017_executive_metrics_seed.sql; read by GET /api/executive/overview.

CREATE TABLE IF NOT EXISTS executive_period_metrics (
  client_scope text NOT NULL CHECK (client_scope IN ('all', 'client-a', 'client-b')),
  period text NOT NULL CHECK (period IN ('today', 'wow', 'mom')),
  snapshot jsonb NOT NULL,
  operational_health jsonb NOT NULL,
  updated_at timestamptz DEFAULT now(),
  PRIMARY KEY (client_scope, period)
);

CREATE INDEX IF NOT EXISTS idx_executive_period_updated ON executive_period_metrics (updated_at DESC);

ALTER TABLE executive_period_metrics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "executive_metrics_read" ON executive_period_metrics;
CREATE POLICY "executive_metrics_read" ON executive_period_metrics FOR SELECT
  USING (auth.role() = 'authenticated');

COMMENT ON TABLE executive_period_metrics IS 'Demo executive dashboard KPIs per client scope and period (today / WoW / MoM).';
