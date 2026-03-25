import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET() {
    try {
        const supabase = await createSupabaseServerClient()

        const today = new Date().toISOString().split('T')[0]

        const { data, error } = await supabase
            .from('attendance_events')
            .select('*, agents(*, user_profiles(*))')
            .gte('event_time', `${today}T00:00:00`)
            .lte('event_time', `${today}T23:59:59`)

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(data)
    } catch {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
