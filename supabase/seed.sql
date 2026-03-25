-- =============================================================================
-- meTru BPO — full dummy data seed (Supabase)
-- Run: `supabase db reset` (applies migrations + this file) OR paste in SQL Editor
-- Default password for all demo logins: Demo123!
-- =============================================================================
-- Prerequisites: migrations applied (001–014). Uses fixed UUIDs from 014_seed_data.
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Namespace for deterministic demo UUIDs (v5)
-- -----------------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.instances LIMIT 1) THEN
    RAISE NOTICE 'auth.instances empty — skipping auth inserts (run on Supabase with Auth enabled).';
  END IF;
END $$;

-- -----------------------------------------------------------------------------
-- 1) Extra teams (10 total): A–D + F–G = Client A; E + H–J = Client B
-- -----------------------------------------------------------------------------
INSERT INTO teams (id, name, client_id) VALUES
  ('b1000000-0000-0000-0000-000000000006', 'Team F', 'a1000000-0000-0000-0000-000000000001'),
  ('b1000000-0000-0000-0000-000000000007', 'Team G', 'a1000000-0000-0000-0000-000000000001'),
  ('b1000000-0000-0000-0000-000000000008', 'Team H', 'a1000000-0000-0000-0000-000000000002'),
  ('b1000000-0000-0000-0000-000000000009', 'Team I', 'a1000000-0000-0000-0000-000000000002'),
  ('b1000000-0000-0000-0000-000000000010', 'Team J', 'a1000000-0000-0000-0000-000000000002')
ON CONFLICT (id) DO NOTHING;

-- Spec baseline: 60 + 40 agents, volumes, chat concurrency (Client B)
UPDATE clients SET
  agents_assigned = 60,
  daily_volume = 1200,
  peak_hours = ARRAY['10:00-14:00', '19:00-21:00']::text[],
  chat_concurrency = NULL
WHERE id = 'a1000000-0000-0000-0000-000000000001';

UPDATE clients SET
  agents_assigned = 40,
  daily_volume = 900,
  peak_hours = ARRAY['09:00-12:00']::text[],
  chat_concurrency = 3
WHERE id = 'a1000000-0000-0000-0000-000000000002';

-- -----------------------------------------------------------------------------
-- 2) Auth users: Executive, Ops, AM, 10× Team Lead, 100× Agent
--    Deterministic IDs via uuid_generate_v5(ns, label)
-- -----------------------------------------------------------------------------
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_sso_user,
  is_anonymous
)
SELECT
  (SELECT id FROM auth.instances LIMIT 1),
  u.uid,
  'authenticated',
  'authenticated',
  u.email,
  crypt('Demo123!', gen_salt('bf')),
  now(),
  now(),
  now(),
  jsonb_build_object('provider', 'email', 'providers', jsonb_build_array('email')),
  '{}'::jsonb,
  false,
  false
FROM (
  SELECT uuid_generate_v5('a0000000-0000-4000-8000-00000000aa01'::uuid, 'metru-exec') AS uid, 'exec@demo.metru.local'::text AS email
  UNION ALL
  SELECT uuid_generate_v5('a0000000-0000-4000-8000-00000000aa01'::uuid, 'metru-ops'), 'ops@demo.metru.local'
  UNION ALL
  SELECT uuid_generate_v5('a0000000-0000-4000-8000-00000000aa01'::uuid, 'metru-am'), 'am@demo.metru.local'
  UNION ALL
  SELECT uuid_generate_v5('a0000000-0000-4000-8000-00000000aa01'::uuid, 'metru-tl-' || n::text), 'tl-' || lpad(n::text, 2, '0') || '@demo.metru.local'
  FROM generate_series(1, 10) n
  UNION ALL
  SELECT uuid_generate_v5('a0000000-0000-4000-8000-00000000aa01'::uuid, 'metru-agent-' || n::text), 'agent-' || lpad(n::text, 3, '0') || '@demo.metru.local'
  FROM generate_series(1, 100) n
) u
WHERE NOT EXISTS (SELECT 1 FROM auth.users x WHERE x.id = u.uid)
  AND EXISTS (SELECT 1 FROM auth.instances LIMIT 1);

-- Identities (email provider) — required for email/password sign-in
INSERT INTO auth.identities (
  id,
  user_id,
  provider_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
SELECT
  gen_random_uuid(),
  u.id,
  u.id::text,
  jsonb_build_object('sub', u.id::text, 'email', u.email, 'email_verified', true, 'phone_verified', false),
  'email',
  now(),
  now(),
  now()
FROM auth.users u
WHERE u.email LIKE '%@demo.metru.local'
  AND NOT EXISTS (
    SELECT 1 FROM auth.identities i WHERE i.user_id = u.id AND i.provider = 'email'
  );

-- -----------------------------------------------------------------------------
-- 3) user_profiles (depends on roles from migration 002)
-- -----------------------------------------------------------------------------
INSERT INTO user_profiles (id, name, email, role_id, team_id, manager_id)
SELECT
  uuid_generate_v5('a0000000-0000-4000-8000-00000000aa01'::uuid, 'metru-exec'),
  'Demo Executive',
  'exec@demo.metru.local',
  (SELECT id FROM roles WHERE name = 'Executive' LIMIT 1),
  NULL,
  NULL
WHERE NOT EXISTS (SELECT 1 FROM user_profiles WHERE id = uuid_generate_v5('a0000000-0000-4000-8000-00000000aa01'::uuid, 'metru-exec'));

INSERT INTO user_profiles (id, name, email, role_id, team_id, manager_id)
SELECT
  uuid_generate_v5('a0000000-0000-4000-8000-00000000aa01'::uuid, 'metru-ops'),
  'Demo Ops Manager',
  'ops@demo.metru.local',
  (SELECT id FROM roles WHERE name = 'Operations Manager' LIMIT 1),
  NULL,
  NULL
WHERE NOT EXISTS (SELECT 1 FROM user_profiles WHERE id = uuid_generate_v5('a0000000-0000-4000-8000-00000000aa01'::uuid, 'metru-ops'));

INSERT INTO user_profiles (id, name, email, role_id, team_id, manager_id)
SELECT
  uuid_generate_v5('a0000000-0000-4000-8000-00000000aa01'::uuid, 'metru-am'),
  'Demo Account Manager',
  'am@demo.metru.local',
  (SELECT id FROM roles WHERE name = 'Account Manager' LIMIT 1),
  NULL,
  NULL
WHERE NOT EXISTS (SELECT 1 FROM user_profiles WHERE id = uuid_generate_v5('a0000000-0000-4000-8000-00000000aa01'::uuid, 'metru-am'));

-- Team leads: one profile per team (ordered A..J)
INSERT INTO user_profiles (id, name, email, role_id, team_id, manager_id)
SELECT
  uuid_generate_v5('a0000000-0000-4000-8000-00000000aa01'::uuid, 'metru-tl-' || t.idx::text),
  'Team Lead ' || chr(64 + t.idx),
  'tl-' || lpad(t.idx::text, 2, '0') || '@demo.metru.local',
  (SELECT id FROM roles WHERE name = 'Team Lead' LIMIT 1),
  t.team_id,
  NULL
FROM (
  VALUES
    (1, 'b1000000-0000-0000-0000-000000000001'::uuid),
    (2, 'b1000000-0000-0000-0000-000000000002'::uuid),
    (3, 'b1000000-0000-0000-0000-000000000003'::uuid),
    (4, 'b1000000-0000-0000-0000-000000000004'::uuid),
    (5, 'b1000000-0000-0000-0000-000000000005'::uuid),
    (6, 'b1000000-0000-0000-0000-000000000006'::uuid),
    (7, 'b1000000-0000-0000-0000-000000000007'::uuid),
    (8, 'b1000000-0000-0000-0000-000000000008'::uuid),
    (9, 'b1000000-0000-0000-0000-000000000009'::uuid),
    (10, 'b1000000-0000-0000-0000-000000000010'::uuid)
) AS t(idx, team_id)
WHERE NOT EXISTS (
  SELECT 1 FROM user_profiles p WHERE p.id = uuid_generate_v5('a0000000-0000-4000-8000-00000000aa01'::uuid, 'metru-tl-' || t.idx::text)
);

UPDATE teams t SET team_lead_id = (
  SELECT p.id FROM user_profiles p
  WHERE p.team_id = t.id AND p.email LIKE 'tl-%@demo.metru.local'
  LIMIT 1
)
WHERE EXISTS (
  SELECT 1 FROM user_profiles p WHERE p.team_id = t.id AND p.email LIKE 'tl-%@demo.metru.local'
);

-- Agents: team index 1..10 from agent number (10 agents per team)
INSERT INTO user_profiles (id, name, email, role_id, team_id, manager_id)
SELECT
  uuid_generate_v5('a0000000-0000-4000-8000-00000000aa01'::uuid, 'metru-agent-' || n::text),
  'Agent ' || lpad(n::text, 3, '0'),
  'agent-' || lpad(n::text, 3, '0') || '@demo.metru.local',
  (SELECT id FROM roles WHERE name = 'Agent Associate' LIMIT 1),
  tid.team_id,
  uuid_generate_v5('a0000000-0000-4000-8000-00000000aa01'::uuid, 'metru-tl-' || tid.idx::text)
FROM generate_series(1, 100) n
CROSS JOIN LATERAL (
  SELECT
    ((n - 1) / 10) + 1 AS idx,
    (ARRAY[
      'b1000000-0000-0000-0000-000000000001'::uuid,
      'b1000000-0000-0000-0000-000000000002'::uuid,
      'b1000000-0000-0000-0000-000000000003'::uuid,
      'b1000000-0000-0000-0000-000000000004'::uuid,
      'b1000000-0000-0000-0000-000000000005'::uuid,
      'b1000000-0000-0000-0000-000000000006'::uuid,
      'b1000000-0000-0000-0000-000000000007'::uuid,
      'b1000000-0000-0000-0000-000000000008'::uuid,
      'b1000000-0000-0000-0000-000000000009'::uuid,
      'b1000000-0000-0000-0000-000000000010'::uuid
    ])[(n - 1) / 10 + 1] AS team_id
) tid
WHERE NOT EXISTS (
  SELECT 1 FROM user_profiles p
  WHERE p.id = uuid_generate_v5('a0000000-0000-4000-8000-00000000aa01'::uuid, 'metru-agent-' || n::text)
);

-- -----------------------------------------------------------------------------
-- 4) agents table (same id as user for simpler joins)
-- -----------------------------------------------------------------------------
INSERT INTO agents (
  id,
  user_profile_id,
  team_id,
  team_lead_id,
  client_id,
  channel,
  contract_start,
  contract_end,
  salary,
  leave_entitlement,
  leave_used,
  ramp_phase,
  status,
  bradford_score
)
SELECT
  p.id,
  p.id,
  p.team_id,
  (SELECT t.team_lead_id FROM teams t WHERE t.id = p.team_id),
  c.client_id,
  c.ch,
  current_date - 180,
  current_date + 180,
  800.00,
  20,
  LEAST(8, (random() * 12)::int),
  'production'::ramp_phase,
  'active'::agent_status,
  0
FROM user_profiles p
JOIN LATERAL (
  SELECT
    CASE p.team_id
      WHEN 'b1000000-0000-0000-0000-000000000001'::uuid THEN 'a1000000-0000-0000-0000-000000000001'::uuid
      WHEN 'b1000000-0000-0000-0000-000000000002'::uuid THEN 'a1000000-0000-0000-0000-000000000001'::uuid
      WHEN 'b1000000-0000-0000-0000-000000000003'::uuid THEN 'a1000000-0000-0000-0000-000000000001'::uuid
      WHEN 'b1000000-0000-0000-0000-000000000004'::uuid THEN 'a1000000-0000-0000-0000-000000000001'::uuid
      WHEN 'b1000000-0000-0000-0000-000000000006'::uuid THEN 'a1000000-0000-0000-0000-000000000001'::uuid
      WHEN 'b1000000-0000-0000-0000-000000000007'::uuid THEN 'a1000000-0000-0000-0000-000000000001'::uuid
      ELSE 'a1000000-0000-0000-0000-000000000002'::uuid
    END AS client_id,
    CASE
      WHEN p.team_id IN (
        'b1000000-0000-0000-0000-000000000001',
        'b1000000-0000-0000-0000-000000000002',
        'b1000000-0000-0000-0000-000000000003',
        'b1000000-0000-0000-0000-000000000004',
        'b1000000-0000-0000-0000-000000000006',
        'b1000000-0000-0000-0000-000000000007'
      ) THEN 'voice'::channel_type
      ELSE 'chat'::channel_type
    END AS ch
) c ON true
WHERE p.email LIKE 'agent-%@demo.metru.local'
  AND NOT EXISTS (SELECT 1 FROM agents a WHERE a.id = p.id);

-- Sample Bradford spells (high score risk for a few agents)
INSERT INTO bradford_entries (agent_id, spell_number, start_date, end_date, days)
SELECT a.id, 1, current_date - 40, current_date - 38, 3
FROM agents a
JOIN user_profiles u ON u.id = a.user_profile_id
WHERE u.email = 'agent-014@demo.metru.local'
  AND NOT EXISTS (
    SELECT 1 FROM bradford_entries be WHERE be.agent_id = a.id AND be.spell_number = 1
  );

INSERT INTO bradford_entries (agent_id, spell_number, start_date, end_date, days)
SELECT a.id, 2, current_date - 20, current_date - 19, 2
FROM agents a
JOIN user_profiles u ON u.id = a.user_profile_id
WHERE u.email = 'agent-014@demo.metru.local'
  AND NOT EXISTS (
    SELECT 1 FROM bradford_entries be WHERE be.agent_id = a.id AND be.spell_number = 2
  );

-- -----------------------------------------------------------------------------
-- 5) Attendance (last 7 days, weekdays — demo volume)
-- -----------------------------------------------------------------------------
INSERT INTO attendance_events (
  agent_id,
  work_date,
  scheduled_start,
  scheduled_end,
  actual_clock_in,
  actual_clock_out,
  status,
  tardiness_minutes,
  current_aux_code
)
SELECT
  a.id,
  d::date,
  '07:00'::time,
  '15:00'::time,
  (d::date + interval '7 hours' + (CASE WHEN random() < 0.12 THEN interval '8 minutes' ELSE interval '0 minutes' END))::timestamptz,
  (d::date + interval '15 hours')::timestamptz,
  CASE WHEN random() < 0.88 THEN 'on-time'::attendance_status ELSE 'late'::attendance_status END,
  CASE WHEN random() < 0.88 THEN 0 ELSE 8 + (random() * 15)::int END,
  'ready'::aux_code
FROM agents a
CROSS JOIN generate_series(current_date - 14, current_date, interval '1 day') d
WHERE extract(isodow FROM d::date) < 6
  AND NOT EXISTS (
    SELECT 1 FROM attendance_events e WHERE e.agent_id = a.id AND e.work_date = d::date
  );

-- -----------------------------------------------------------------------------
-- 6) Live metrics + FTE snapshots (per client / team)
-- -----------------------------------------------------------------------------
INSERT INTO live_metrics_snapshots (
  client_id,
  snapshot_at,
  interval_start,
  service_level,
  calls_in_queue,
  occupancy,
  aht_current,
  aht_target,
  acw_current,
  acw_target,
  adherence,
  agents_scheduled,
  agents_logged_in,
  volume_actual
)
SELECT
  c.id,
  now() - (m * interval '30 minutes'),
  (time '10:00:00' + m * interval '30 minutes')::time,
  0.75 + (random() * 0.18),
  (random() * 15)::int,
  0.72 + (random() * 0.15),
  280 + (random() * 120)::int,
  c.aht_target,
  42 + (random() * 30)::int,
  c.acw_target,
  0.82 + (random() * 0.12),
  60,
  51 + (random() * 8)::int,
  40 + (random() * 20)::int
FROM clients c
CROSS JOIN generate_series(0, 7) m
WHERE NOT EXISTS (
  SELECT 1 FROM live_metrics_snapshots l
  WHERE l.client_id = c.id
    AND l.interval_start = (time '10:00:00' + m * interval '30 minutes')::time
    AND l.snapshot_at::date = current_date
);

INSERT INTO fte_loss_snapshots (
  team_id,
  snapshot_at,
  nominal_ftes,
  effective_ftes,
  total_loss,
  loss_percentage,
  daily_cost_impact,
  monthly_cost_projection,
  category_breakdown,
  client_attribution,
  trend
)
SELECT
  t.id,
  now(),
  10,
  10 - (random() * 4),
  random() * 4,
  LEAST(95, 8 + (random() * 45)),
  50 + (random() * 200)::numeric,
  1200 + (random() * 800)::numeric,
  '{"aht":0.4,"acw":0.2,"adherence":0.3}'::jsonb,
  jsonb_build_array(jsonb_build_object('clientName', cl.name, 'fteLost', 1.2, 'slaImpact', 2.0)),
  (ARRAY['improving', 'stable', 'worsening']::fte_trend[])[1 + floor(random() * 3)::int]
FROM teams t
JOIN clients cl ON cl.id = t.client_id
WHERE NOT EXISTS (
  SELECT 1 FROM fte_loss_snapshots f WHERE f.team_id = t.id AND f.snapshot_at::date = current_date
);

-- -----------------------------------------------------------------------------
-- 7) Productivity tickets (link TL where possible)
-- -----------------------------------------------------------------------------
INSERT INTO productivity_tickets (
  team_id,
  team_lead_id,
  priority,
  status,
  trigger_description,
  root_cause_analysis,
  suggested_actions,
  action_taken,
  is_recurring
)
SELECT
  'b1000000-0000-0000-0000-000000000002',
  tm.team_lead_id,
  'high'::ticket_priority,
  'open'::ticket_status,
  'FTE Loss 42% — AHT + adherence (demo)',
  ARRAY['AHT overrun', 'Extended personal AUX peak'],
  ARRAY['Coaching block', 'Shift break flex'],
  NULL,
  false
FROM teams tm
WHERE tm.id = 'b1000000-0000-0000-0000-000000000002'
  AND NOT EXISTS (
    SELECT 1 FROM productivity_tickets x
    WHERE x.team_id = tm.id AND x.trigger_description LIKE 'FTE Loss 42%'
  );

-- -----------------------------------------------------------------------------
-- 8) Leave requests + payroll + overtime + audit
-- -----------------------------------------------------------------------------
INSERT INTO leave_requests (
  agent_id,
  type,
  start_date,
  end_date,
  days_requested,
  status
)
SELECT
  a.id,
  'paid'::leave_type,
  current_date + 14,
  current_date + 15,
  2,
  'pending'::leave_request_status
FROM agents a
JOIN user_profiles u ON u.id = a.user_profile_id
WHERE u.email = 'agent-012@demo.metru.local'
  AND NOT EXISTS (SELECT 1 FROM leave_requests lr WHERE lr.agent_id = a.id AND lr.start_date = current_date + 14);

INSERT INTO payroll_lines (
  agent_id,
  period,
  base_hours,
  overtime_hours,
  overtime_cost,
  night_diff_hours,
  night_diff_cost,
  tardiness_deduction_minutes,
  gross_pay,
  approved
)
SELECT
  a.id,
  to_char(current_date, 'YYYY-MM'),
  160,
  0,
  0,
  4,
  18.00,
  3,
  824.50,
  false
FROM agents a
JOIN user_profiles u ON u.id = a.user_profile_id
WHERE u.email = 'agent-012@demo.metru.local'
ON CONFLICT (agent_id, period) DO NOTHING;

INSERT INTO overtime_requests (
  agent_id,
  client_id,
  work_date,
  start_time,
  end_time,
  hours,
  rate_multiplier,
  cost,
  status,
  sla_penalty_risk
)
SELECT
  a.id,
  a.client_id,
  current_date + 1,
  '14:00'::time,
  '18:00'::time,
  4,
  1.5,
  45.00,
  'pending',
  500.00
FROM agents a
JOIN user_profiles u ON u.id = a.user_profile_id
WHERE u.email = 'agent-028@demo.metru.local'
  AND NOT EXISTS (SELECT 1 FROM overtime_requests o WHERE o.agent_id = a.id AND o.work_date = current_date + 1);

INSERT INTO audit_log (user_id, action, table_name, record_id, new_values)
SELECT
  uuid_generate_v5('a0000000-0000-4000-8000-00000000aa01'::uuid, 'metru-exec'),
  'seed',
  'agents',
  a.id,
  jsonb_build_object('note', 'dummy seed')
FROM (SELECT id FROM agents LIMIT 1) a
WHERE NOT EXISTS (
  SELECT 1 FROM audit_log al WHERE al.action = 'seed' AND al.table_name = 'agents'
);

-- -----------------------------------------------------------------------------
-- 9) Schedule intervals sample (Erlang demo)
-- -----------------------------------------------------------------------------
INSERT INTO schedule_intervals (
  client_id,
  work_date,
  interval_start,
  interval_end,
  required_agents,
  scheduled_agents,
  volume_forecast,
  erlang_traffic,
  projected_sl,
  projected_occupancy
)
SELECT
  'a1000000-0000-0000-0000-000000000001',
  current_date,
  (time '07:00:00' + m * interval '30 minutes')::time,
  (time '07:00:00' + (m + 1) * interval '30 minutes')::time,
  12 + m,
  11,
  80 + m * 5,
  8.5 + m * 0.2,
  0.78,
  0.81
FROM generate_series(0, 15) m
ON CONFLICT (client_id, work_date, interval_start) DO NOTHING;

-- -----------------------------------------------------------------------------
COMMENT ON SCHEMA public IS 'meTru BPO demo — seeded via supabase/seed.sql';
