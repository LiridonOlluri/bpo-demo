import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/** Server routes: service role when set; otherwise anon (requires RLS policies for anon SELECT). */
export function getExecutiveSupabase(): SupabaseClient {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'http://localhost:54321'
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (serviceKey && serviceKey !== 'missing-service-role-key') {
        return createClient(url, serviceKey)
    }
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!anon) {
        throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY not set')
    }
    return createClient(url, anon)
}
