// lib/supabase/client.ts — browser client (use in components, hooks)
import { createBrowserClient } from '@supabase/ssr'

export const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'http://localhost:54321',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'missing-anon-key'
)
