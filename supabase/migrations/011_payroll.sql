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
