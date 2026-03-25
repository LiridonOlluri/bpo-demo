import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET() {
    try {
        const supabase = await createSupabaseServerClient()

        const { data, error } = await supabase
            .from('productivity_tickets')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(data)
    } catch {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
