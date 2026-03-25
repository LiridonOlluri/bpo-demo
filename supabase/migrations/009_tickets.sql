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
