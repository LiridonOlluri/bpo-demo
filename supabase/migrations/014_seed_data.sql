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
