-- Allow anon + authenticated read on executive demo tables (API routes without service role, local dev)

DROP POLICY IF EXISTS "executive_metrics_read" ON executive_period_metrics;
CREATE POLICY "executive_metrics_read" ON executive_period_metrics FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "executive_sl_read" ON executive_sl_curves;
CREATE POLICY "executive_sl_read" ON executive_sl_curves FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "executive_demo_cfg_read" ON executive_demo_config;
CREATE POLICY "executive_demo_cfg_read" ON executive_demo_config FOR SELECT TO anon, authenticated USING (true);
