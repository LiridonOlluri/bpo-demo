-- 004: Clients (idempotent)
CREATE TABLE IF NOT EXISTS clients (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  industry text not null,
  channel channel_type not null,
  agents_assigned integer not null default 0,
  sla_percentage numeric(5,2) not null,
  sla_seconds integer not null,
  aht_target integer not null,
  acw_target integer not null,
  daily_volume integer not null,
  peak_hours text[] default '{}',
  occupancy_target numeric(4,2) not null default 0.80,
  occupancy_cap numeric(4,2) not null default 0.88,
  chat_concurrency integer,
  required_certifications text[] default '{}',
  billing_model billing_model not null,
  operating_hours_start time not null default '07:00',
  operating_hours_end time not null default '22:00',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

DO $$ BEGIN
  ALTER TABLE teams ADD COLUMN client_id uuid REFERENCES clients(id);
EXCEPTION WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE agents ADD CONSTRAINT fk_agents_client FOREIGN KEY (client_id) REFERENCES clients(id);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tl_plus_read" ON clients;
CREATE POLICY "tl_plus_read" ON clients FOR SELECT
  USING (EXISTS (SELECT 1 FROM user_profiles up JOIN roles r ON up.role_id = r.id
                 WHERE up.id = auth.uid() AND r.level::text::int >= 2));
DROP POLICY IF EXISTS "ops_plus_write" ON clients;
CREATE POLICY "ops_plus_write" ON clients FOR ALL
  USING (EXISTS (SELECT 1 FROM user_profiles up JOIN roles r ON up.role_id = r.id
                 WHERE up.id = auth.uid() AND r.level::text::int >= 3));
