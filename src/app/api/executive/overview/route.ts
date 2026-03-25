import { NextRequest, NextResponse } from 'next/server'
import { filterTeamsByClient, filterTlScoresByClient } from '@/lib/executiveFilters'
import { isValidExecutiveQuery, parseExecutiveClient, parseExecutivePeriod } from '@/lib/executiveParams'
import { getExecutiveSupabase } from '@/lib/supabase/executiveClient'
import type { ExecutiveOverviewBundle, ExecutiveSnapshot, ExecutiveOperationalHealthRow, SlChartPoint } from '@/types/executive'
import type { FteLossTeamSummary } from '@/types/fteLoss'
import type { TeamLeadScore } from '@/types/performance'

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const rawClient = searchParams.get('client')
    const rawPeriod = searchParams.get('period')

    if (!isValidExecutiveQuery(rawClient, rawPeriod)) {
        return NextResponse.json({ error: 'Invalid client or period' }, { status: 400 })
    }

    const client = parseExecutiveClient(rawClient)
    const period = parseExecutivePeriod(rawPeriod)

    let supabase
    try {
        supabase = getExecutiveSupabase()
    } catch {
        return NextResponse.json({ error: 'SUPABASE_NOT_CONFIGURED' }, { status: 503 })
    }

    const [{ data: pm, error: e1 }, { data: slRow, error: e2 }, { data: cfg, error: e3 }] = await Promise.all([
        supabase.from('executive_period_metrics').select('snapshot, operational_health').eq('client_scope', client).eq('period', period).maybeSingle(),
        supabase.from('executive_sl_curves').select('points').eq('client_scope', client).maybeSingle(),
        supabase.from('executive_demo_config').select('fte_teams, tl_scores').eq('id', 1).maybeSingle(),
    ])

    if (e1 || e2 || e3) {
        return NextResponse.json({ error: 'MISSING_EXECUTIVE_DATA', details: e1?.message ?? e2?.message ?? e3?.message }, { status: 503 })
    }

    if (!pm?.snapshot || !pm?.operational_health || !slRow?.points || !cfg?.fte_teams || !cfg?.tl_scores) {
        return NextResponse.json({ error: 'MISSING_EXECUTIVE_DATA' }, { status: 503 })
    }

    const fteTeams = cfg.fte_teams as FteLossTeamSummary[]
    const tlScores = cfg.tl_scores as TeamLeadScore[]
    const teams = filterTeamsByClient(fteTeams, client)
    const tlFiltered = filterTlScoresByClient(fteTeams, tlScores, client)

    const body: ExecutiveOverviewBundle = {
        clientScope: client,
        period,
        snapshot: pm.snapshot as ExecutiveSnapshot,
        operationalHealth: pm.operational_health as ExecutiveOperationalHealthRow,
        slChart: slRow.points as SlChartPoint[],
        fteTeams: teams,
        tlScores: tlFiltered,
        source: 'db',
    }
    return NextResponse.json(body)
}
