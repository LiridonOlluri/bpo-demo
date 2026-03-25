import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET() {
    try {
        const supabase = await createSupabaseServerClient()

        const { data: teams, error: teamsError } = await supabase
            .from('teams')
            .select('id')

        if (teamsError) {
            return NextResponse.json({ error: teamsError.message }, { status: 500 })
        }

        const snapshots = await Promise.all(
            (teams ?? []).map(async (team) => {
                const { data, error } = await supabase
                    .from('fte_loss_snapshots')
                    .select('*')
                    .eq('team_id', team.id)
                    .order('snapshot_date', { ascending: false })
                    .limit(1)
                    .single()

                if (error) return null
                return data
            })
        )

        return NextResponse.json(snapshots.filter(Boolean))
    } catch {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
