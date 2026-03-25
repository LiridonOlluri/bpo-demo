-- 002: Roles & Users (idempotent)
CREATE TABLE IF NOT EXISTS roles (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  level access_level not null,
  modules text[] not null default '{}',
  permissions jsonb not null default '{}',
  created_at timestamptz default now()
);

INSERT INTO roles (name, level, modules, permissions) VALUES
  ('Agent Associate', '1', array['attendance','payroll','leave','training'],
    '{"attendance":["view"],"payroll":["view"],"leave":["view","edit"],"training":["view"]}'),
  ('Team Lead', '2', array['attendance','workforce','performance','quality','leave','payroll'],
    '{"attendance":["view","edit"],"workforce":["view"],"performance":["view","edit"],"quality":["view","edit"],"leave":["view","approve"],"payroll":["view"]}'),
  ('Account Manager', '3', array['clients','billing','performance','quality'],
    '{"clients":["view","edit"],"billing":["view","edit"],"performance":["view"],"quality":["view"]}'),
  ('Operations Manager', '3', array['attendance','workforce','performance','quality','leave','payroll','hr','clients','compliance'],
    '{"attendance":["view","edit","approve"],"workforce":["view","edit","approve"],"performance":["view","edit","approve"],"leave":["view","edit","approve"],"payroll":["view","approve"],"hr":["view","edit"]}'),
  ('Executive', '5', array['overview','clients','workforce','attendance','performance','quality','payroll','billing','hr','compliance','training','settings'],
    '{"*":["view","edit","approve","admin"]}')
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  role_id uuid references roles(id),
  team_id uuid,
  manager_id uuid references user_profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "users_read_own" ON user_profiles;
CREATE POLICY "users_read_own" ON user_profiles FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "managers_read_team" ON user_profiles;
CREATE POLICY "managers_read_team" ON user_profiles FOR SELECT
  USING (manager_id = auth.uid() OR id = auth.uid());
DROP POLICY IF EXISTS "admin_all" ON user_profiles;
CREATE POLICY "admin_all" ON user_profiles FOR ALL
  USING (EXISTS (SELECT 1 FROM user_profiles up JOIN roles r ON up.role_id = r.id
                 WHERE up.id = auth.uid() AND r.level IN ('4','5')));
