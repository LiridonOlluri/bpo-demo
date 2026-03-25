// lib/supabase/admin.ts — admin client (bypasses RLS — server-side only)
import { createClient } from '@supabase/supabase-js'

export const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'http://localhost:54321',
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'missing-service-role-key'
)
