import type { FteLossTeamSummary } from '@/types/fteLoss'
import type { TeamLeadScore } from '@/types/performance'

/** UC-5B — Executive client filter */
export type ExecutiveClientFilter = 'all' | 'client-a' | 'client-b'

export type ExecutivePeriod = 'today' | 'wow' | 'mom'

export type ExecutiveSnapshot = {
    headlineAgents: number
    active: number
    leave: number
    sick: number
    late: number
    ncns: number
    slAvg: string
    slTrend: 'up' | 'down' | 'flat'
    slTrendValue: string
    slVariant: 'green' | 'amber' | 'red'
    fteLossAvg: string
    fteTrend: 'up' | 'down' | 'flat'
    fteTrendValue: string
    fteVariant: 'green' | 'amber' | 'red'
    openTickets: number
    openTicketsTrend: string
    revenueMtd: string
    revenueStatLabel: string
    revenueTrend: 'up' | 'down' | 'flat'
    revenueTrendValue: string
    leaveDays: number
    leaveEur: number
    smartPushMtd: number
    costUnproductiveDay: string
    filterLabel: string
}

export type ExecutiveOperationalHealthRow = {
    fte: string
    fteVs: string
    unplanned: string
    unplannedVs: string
    onTime: string
    onTimeVs: string
    cost: string
}

export type SlChartPoint = { time: string; serviceLevel: number; target: number }

export type PerfLiveStat = {
    sl: string
    slVariant: 'green' | 'amber' | 'red'
    occupancy: string
    occVariant: 'green' | 'amber' | 'red'
    aht: string
    ahtVariant: 'green' | 'amber'
    acw: string
    acwVariant: 'green' | 'amber'
    adherence: string
    adhVariant: 'green' | 'amber' | 'red'
    fteLoss: string
    fteVariant: 'green' | 'amber' | 'red'
}

/** Response from GET /api/executive/overview */
export type ExecutiveOverviewBundle = {
    clientScope: string
    period: string
    snapshot: ExecutiveSnapshot
    operationalHealth: ExecutiveOperationalHealthRow
    slChart: SlChartPoint[]
    fteTeams: FteLossTeamSummary[]
    tlScores: TeamLeadScore[]
    source: 'db'
}

/** Response from GET /api/performance/demo */
export type PerformanceDemoPayload = {
    fteTeams: FteLossTeamSummary[]
    teamTabs: { id: string; label: string }[]
    fteTableRows: {
        name: string
        nominal: number
        effective: number
        loss: number
        cost: number
    }[]
    perfLiveStats: Record<string, PerfLiveStat>
    slByClient: {
        'client-a': SlChartPoint[]
        'client-b': SlChartPoint[]
    }
}
