import { NextResponse } from 'next/server'
import { getExecutiveSupabase } from '@/lib/supabase/executiveClient'
import type { PerformanceDemoPayload, PerfLiveStat, SlChartPoint } from '@/types/executive'
import type { FteLossTeamSummary } from '@/types/fteLoss'

export async function GET() {
    let supabase
    try {
        supabase = getExecutiveSupabase()
    } catch {
        return NextResponse.json({ error: 'SUPABASE_NOT_CONFIGURED' }, { status: 503 })
    }

    const [{ data: cfg, error: e1 }, { data: slA, error: e2 }, { data: slB, error: e3 }] = await Promise.all([
        supabase.from('executive_demo_config').select('fte_teams, perf_live_stats').eq('id', 1).maybeSingle(),
        supabase.from('executive_sl_curves').select('points').eq('client_scope', 'client-a').maybeSingle(),
        supabase.from('executive_sl_curves').select('points').eq('client_scope', 'client-b').maybeSingle(),
    ])

    if (e1 || e2 || e3) {
        return NextResponse.json({ error: 'MISSING_PERFORMANCE_DEMO', details: e1?.message ?? e2?.message ?? e3?.message }, { status: 503 })
    }

    if (!cfg?.fte_teams || !cfg?.perf_live_stats || !slA?.points || !slB?.points) {
        return NextResponse.json({ error: 'MISSING_PERFORMANCE_DEMO' }, { status: 503 })
    }

    const fteTeams = cfg.fte_teams as FteLossTeamSummary[]
    const perfLiveStats = cfg.perf_live_stats as Record<string, PerfLiveStat>

    const teamTabs = fteTeams.map((t) => ({
        id: t.teamId,
        label: t.teamName.split(' — ')[0] ?? t.teamId,
    }))

    const fteTableRows = fteTeams.map((t) => ({
        name: (t.teamName.split(' — ')[0] ?? t.teamId) as string,
        nominal: t.nominalFtes,
        effective: t.effectiveFtes,
        loss: t.lossPercentage,
        cost: t.dailyCostImpact,
    }))

    const payload: PerformanceDemoPayload = {
        fteTeams,
        teamTabs,
        fteTableRows,
        perfLiveStats,
        slByClient: {
            'client-a': slA.points as SlChartPoint[],
            'client-b': slB.points as SlChartPoint[],
        },
    }

    return NextResponse.json(payload)
}
