import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ ticketId: string }> }
) {
    try {
        const { ticketId } = await params
        const supabase = await createSupabaseServerClient()

        const { data, error } = await supabase
            .from('productivity_tickets')
            .select('*')
            .eq('id', ticketId)
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 404 })
        }

        return NextResponse.json(data)
    } catch {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
