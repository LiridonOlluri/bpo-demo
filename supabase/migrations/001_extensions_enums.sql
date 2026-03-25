-- 001: Extensions & Enums (idempotent)
create extension if not exists "uuid-ossp";

DO $$ BEGIN CREATE TYPE access_level AS ENUM ('1','2','3','4','5'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE channel_type AS ENUM ('voice','chat','email','back-office'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE billing_model AS ENUM ('per-minute','per-fte','fixed','hybrid'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE attendance_status AS ENUM ('on-time','late','absent','ncns','on-leave','not-started'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE aux_code AS ENUM ('ready','on-call','wrap-up','break','lunch','meeting','coaching','training','personal','system-down','project'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE leave_type AS ENUM ('paid','unpaid','sick','training','maternity','bereavement'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE leave_request_status AS ENUM ('pending','approved','blocked','cancelled'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE ticket_priority AS ENUM ('low','medium','high','critical'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE ticket_status AS ENUM ('open','acknowledged','action-taken','follow-up','resolved','recurring'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE shift_type AS ENUM ('early','mid','late','custom'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE agent_status AS ENUM ('active','on-leave','terminated','onboarding'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE ramp_phase AS ENUM ('classroom','nesting','guided','production'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE shrinkage_type AS ENUM ('planned','unplanned'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE shrinkage_scope AS ENUM ('internal','external'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE bradford_threshold AS ENUM ('green','amber','red','critical'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE ticket_action_category AS ENUM ('coaching','schedule-adjustment','agent-reassignment','hr-escalation','it-ticket','other'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE follow_up_result AS ENUM ('improved','not-improved','pending'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE leave_week_status AS ENUM ('green','amber','red'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE fte_trend AS ENUM ('improving','stable','worsening'); EXCEPTION WHEN duplicate_object THEN null; END $$;
