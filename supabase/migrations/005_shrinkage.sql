-- 005: Shrinkage Configuration (idempotent)
CREATE TABLE IF NOT EXISTS shrinkage_categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  type shrinkage_type not null,
  scope shrinkage_scope not null,
  percentage numeric(5,2) not null,
  minutes_per_day integer not null default 0,
  is_moveable boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz default now()
);

INSERT INTO shrinkage_categories (name, type, scope, percentage, minutes_per_day, is_moveable, sort_order) VALUES
  ('Paid Breaks (2 x 15 min)', 'planned', 'internal', 6.3, 30, true, 1),
  ('Team Meetings / Huddles', 'planned', 'internal', 2.1, 10, true, 2),
  ('One-on-One Coaching', 'planned', 'internal', 1.6, 8, true, 3),
  ('Training Sessions', 'planned', 'internal', 2.1, 10, true, 4),
  ('QA Calibration / Feedback', 'planned', 'internal', 0.8, 4, true, 5),
  ('Annual Leave / Vacation', 'planned', 'external', 5.0, 0, false, 6),
  ('Public Holidays', 'planned', 'external', 2.1, 0, false, 7),
  ('Planned Leave Buffer', 'planned', 'external', 1.0, 0, false, 8),
  ('Sick Leave', 'unplanned', 'external', 3.5, 0, false, 9),
  ('Tardiness / Late Arrivals', 'unplanned', 'external', 1.0, 0, false, 10),
  ('Early Departures', 'unplanned', 'external', 0.5, 0, false, 11),
  ('No-Call-No-Show', 'unplanned', 'external', 0.5, 0, false, 12),
  ('Extended Breaks (overruns)', 'unplanned', 'internal', 1.0, 0, false, 13),
  ('Unscheduled Personal Time', 'unplanned', 'internal', 1.0, 0, false, 14),
  ('System Downtime', 'unplanned', 'internal', 1.0, 0, false, 15),
  ('Special Projects / Back-Office', 'unplanned', 'internal', 0.5, 0, false, 16)
ON CONFLICT (name) DO NOTHING;

ALTER TABLE shrinkage_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth_read" ON shrinkage_categories;
CREATE POLICY "auth_read" ON shrinkage_categories FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "admin_write" ON shrinkage_categories;
CREATE POLICY "admin_write" ON shrinkage_categories FOR ALL
  USING (EXISTS (SELECT 1 FROM user_profiles up JOIN roles r ON up.role_id = r.id
                 WHERE up.id = auth.uid() AND r.level::text::int >= 4));
