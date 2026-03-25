// lib/supabase/server.ts — server client (use in API routes, Server Components)
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createSupabaseServerClient() {
    const cookieStore = await cookies()
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'http://localhost:54321',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'missing-anon-key',
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if middleware handles refreshing.
                    }
                },
            },
        }
    )
}
