import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ teamId: string }> }
) {
    try {
        const { teamId } = await params
        const supabase = await createSupabaseServerClient()

        const { data, error } = await supabase
            .from('fte_loss_snapshots')
            .select('*')
            .eq('team_id', teamId)
            .order('snapshot_date', { ascending: false })
            .limit(1)
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 404 })
        }

        return NextResponse.json(data)
    } catch {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
