'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { useRole } from '@/hooks/useRole'
import { getRoleHomePath } from '@/lib/demoRoles'
import { DEMO_DEFAULTS } from '@/lib/constants'
import { useExecutiveOverview } from '@/lib/api/queries/useExecutiveOverview'
import type { ExecutiveClientFilter, ExecutivePeriod } from '@/types/executive'
import { countIntervalsBelowSlTarget } from '@/lib/executiveChartUtils'
import { Spinner } from '@/components/atoms/Spinner'
import { ExecutiveTemplate } from '@/components/templates/ExecutiveTemplate'
import { StatCard } from '@/components/molecules/StatCard'
import { ServiceLevelChart } from '@/components/organisms/ServiceLevelChart'
import { FteLossComparative } from '@/components/organisms/FteLossComparative'
import { TeamLeadScorecard } from '@/components/organisms/TeamLeadScorecard'
import { AgentStateGrid } from '@/components/organisms/AgentStateGrid'
import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import { AiFeatureLock } from '@/components/molecules/AiFeatureLock'
import { TabGroup } from '@/components/molecules/TabGroup'

/* ─── Static demo data (not in DB — narrative/spec values) ──────────────── */
const ATTRITION_ALL = {
    departures: 4, lastMonth: 6, voluntary: 2, performance: 1, endOfContract: 1,
    annualised: 32, costThisMonth: 12_000, costLastMonth: 18_000, retention: 96, avgTenure: 8.4,
    byTenure: [
        { band: '0–90 days', count: 2, pct: 40, label: 'Onboarding problem' },
        { band: '90–180 days', count: 1, pct: 20, label: 'Engagement problem' },
        { band: '180+ days', count: 1, pct: 40, label: 'Compensation / growth' },
    ],
}
const ATTRITION_CLIENT_A = {
    departures: 3, lastMonth: 4, voluntary: 2, performance: 1, endOfContract: 0,
    annualised: 38, costThisMonth: 7_200, costLastMonth: 9_600, retention: 95, avgTenure: 7.8,
    byTenure: [
        { band: '0–90 days', count: 2, pct: 67, label: 'Onboarding problem' },
        { band: '90–180 days', count: 1, pct: 33, label: 'Engagement problem' },
        { band: '180+ days', count: 0, pct: 0, label: '' },
    ],
    note: 'Highest attrition team: Team B (2 of 3 departures)',
}
const ATTRITION_CLIENT_B = {
    departures: 1, lastMonth: 2, voluntary: 0, performance: 0, endOfContract: 1,
    annualised: 24, costThisMonth: 2_400, costLastMonth: 4_800, retention: 97.5, avgTenure: 9.2,
    byTenure: [
        { band: '0–90 days', count: 0, pct: 0, label: '' },
        { band: '90–180 days', count: 0, pct: 0, label: '' },
        { band: '180+ days', count: 1, pct: 100, label: 'Contract end' },
    ],
}
const SHRINKAGE_CLIENT_A = [
    { label: 'Sick', pct: 4.2, variant: 'red' as const },
    { label: 'Tardiness', pct: 1.8, variant: 'amber' as const },
    { label: 'Extended breaks', pct: 1.4, variant: 'amber' as const },
    { label: 'NCNS', pct: 0.8, variant: 'red' as const },
    { label: 'System downtime', pct: 0.5, variant: 'grey' as const },
    { label: 'Personal AUX', pct: 1.2, variant: 'amber' as const },
]
const SHRINKAGE_CLIENT_B = [
    { label: 'Sick', pct: 2.8, variant: 'amber' as const },
    { label: 'Tardiness', pct: 1.1, variant: 'amber' as const },
    { label: 'Extended breaks', pct: 1.0, variant: 'amber' as const },
    { label: 'NCNS', pct: 0.3, variant: 'grey' as const },
    { label: 'System downtime', pct: 0.4, variant: 'grey' as const },
    { label: 'Personal AUX', pct: 2.8, variant: 'amber' as const },
]
const SHRINKAGE_ALL = [
    { label: 'Sick', pct: 3.7, variant: 'amber' as const },
    { label: 'Tardiness', pct: 1.6, variant: 'amber' as const },
    { label: 'Extended breaks', pct: 1.2, variant: 'amber' as const },
    { label: 'NCNS', pct: 0.6, variant: 'grey' as const },
    { label: 'System downtime', pct: 0.4, variant: 'grey' as const },
    { label: 'Personal AUX', pct: 2.1, variant: 'amber' as const },
]
const CLIENT_FTE_TABLE = [
    { client: 'Client A', teams: 6, nominal: 60, effective: 48.2, lossPct: 19.7, eurDay: 472, mainDriver: 'AHT overrun', unplanned: 11.2 },
    { client: 'Client B', teams: 4, nominal: 40, effective: 34.8, lossPct: 13.0, eurDay: 208, mainDriver: 'Adherence', unplanned: 8.4 },
]
const MISSING_MINUTES_DATA: Record<string, { total: number; eurCost: number }> = {
    all: { total: 284, eurCost: 170 },
    'client-a': { total: 198, eurCost: 119 },
    'client-b': { total: 86, eurCost: 51 },
}

const CLIENT_FILTER_TABS = [
    { id: 'all', label: 'All clients' },
    { id: 'client-a', label: 'Client A' },
    { id: 'client-b', label: 'Client B' },
]

const PERIOD_TABS = [
    { id: 'today', label: 'Today vs yesterday' },
    { id: 'wow', label: 'This week vs last week' },
    { id: 'mom', label: 'This month vs last month' },
]

function periodShort(p: ExecutivePeriod) {
    if (p === 'today') return 'DoD'
    if (p === 'wow') return 'WoW'
    return 'MoM'
}

export default function OverviewPage() {
    const router = useRouter()
    const { level } = useRole()
    const [clientFilter, setClientFilter] = useState<ExecutiveClientFilter>('all')
    const [period, setPeriod] = useState<ExecutivePeriod>('wow')

    const { data, isFetching, isError, isPending } = useExecutiveOverview(clientFilter, period)

    const belowTargetIntervals = useMemo(
        () => (data?.slChart?.length ? countIntervalsBelowSlTarget(data.slChart) : 0),
        [data?.slChart]
    )

    const onClientFilter = useCallback((id: string) => {
        const next = id as ExecutiveClientFilter
        setClientFilter(next)
        const label = CLIENT_FILTER_TABS.find((t) => t.id === id)?.label ?? id
        toast.success('View updated', { description: `Executive data filtered: ${label}` })
    }, [])

    useEffect(() => {
        if (level !== 5) {
            router.replace(getRoleHomePath(level))
        }
    }, [level, router])

    useEffect(() => {
        if (isError) {
            toast.error('Could not load executive KPIs', { description: 'Check Supabase and migrations 016–019.' })
        }
    }, [isError])

    if (level !== 5) {
        return null
    }

    if (isPending) {
        return (
            <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
                <Spinner size={32} />
                <p className="text-sm text-brand-gray">Loading executive KPIs…</p>
            </div>
        )
    }

    if (isError || !data) {
        return (
            <div className="flex min-h-[50vh] flex-col items-center justify-center gap-2 px-4 text-center">
                <h1 className="text-xl font-semibold">Executive Overview</h1>
                <p className="text-brand-gray">Could not load executive KPIs.</p>
                <p className="text-sm text-brand-gray">Ensure Supabase is running and migrations 016–019 are applied.</p>
            </div>
        )
    }

    const { snapshot, operationalHealth: health, fteTeams: teams, tlScores, slChart: slData } = data

    const slChartTitle =
        clientFilter === 'all'
            ? 'Service Level — blended (weighted A:B)'
            : clientFilter === 'client-a'
              ? 'Service Level — Client A (80/20)'
              : 'Service Level — Client B (90% < 60s)'

    const slTarget = slData[0]?.target ?? 80

    const subtitle =
        clientFilter === 'all'
            ? `Real-time cross-client snapshot — ${DEMO_DEFAULTS.agentCount} agents, ${DEMO_DEFAULTS.teamCount} teams, ${DEMO_DEFAULTS.clientCount} clients (spec v1.0 baseline)`
            : `${snapshot.filterLabel} — ${snapshot.headlineAgents} agents, ${teams.length} teams`

    const tlSubtitle =
        clientFilter === 'all' ? undefined : `Team leads for ${snapshot.filterLabel.toLowerCase()} only`

    const attrition = clientFilter === 'all' ? ATTRITION_ALL : clientFilter === 'client-a' ? ATTRITION_CLIENT_A : ATTRITION_CLIENT_B
    const shrinkageBreakdown = clientFilter === 'all' ? SHRINKAGE_ALL : clientFilter === 'client-a' ? SHRINKAGE_CLIENT_A : SHRINKAGE_CLIENT_B
    const missingMin = MISSING_MINUTES_DATA[clientFilter] ?? MISSING_MINUTES_DATA.all
    const totalLossEurDay = clientFilter === 'all'
        ? CLIENT_FTE_TABLE.reduce((s, r) => s + r.eurDay, 0)
        : clientFilter === 'client-a' ? 472 : 208

    return (
        <ExecutiveTemplate
            title="Executive Overview"
            subtitle={subtitle}
            summary={
                <>
                    <StatCard
                        label="Agents in scope"
                        value={snapshot.headlineAgents}
                        trend="flat"
                        trendValue={`${teams.length} teams · ${DEMO_DEFAULTS.teamLeadCount} TLs (non-prod, company)`}
                        variant="default"
                    />
                    <StatCard
                        label="Active now"
                        value={snapshot.active}
                        trend="up"
                        trendValue={`${Math.round((snapshot.active / snapshot.headlineAgents) * 100)}% online`}
                        variant="green"
                    />
                    <StatCard
                        label="SL average"
                        value={snapshot.slAvg}
                        trend={snapshot.slTrend}
                        trendValue={snapshot.slTrendValue}
                        variant={snapshot.slVariant}
                    />
                    <StatCard
                        label="FTE loss avg"
                        value={snapshot.fteLossAvg}
                        trend={snapshot.fteTrend}
                        trendValue={snapshot.fteTrendValue}
                        variant={snapshot.fteVariant}
                    />
                    <StatCard
                        label="Open tickets"
                        value={snapshot.openTickets}
                        trend="up"
                        trendValue={snapshot.openTicketsTrend}
                        variant="amber"
                    />
                    <StatCard
                        label={snapshot.revenueStatLabel}
                        value={snapshot.revenueMtd}
                        trend={snapshot.revenueTrend}
                        trendValue={snapshot.revenueTrendValue}
                        variant="green"
                    />
                </>
            }
        >
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                    <TabGroup tabs={CLIENT_FILTER_TABS} activeTab={clientFilter} onChange={onClientFilter} />
                    <Badge variant="green" className="text-xs">
                        KPIs from database
                    </Badge>
                    {isFetching && (
                        <span className="text-xs text-brand-gray" aria-live="polite">
                            Updating…
                        </span>
                    )}
                </div>
                <TabGroup tabs={PERIOD_TABS} activeTab={period} onChange={(id) => setPeriod(id as ExecutivePeriod)} />
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
                <Card className="lg:col-span-1">
                    <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-gray">Live workforce snapshot</h2>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="rounded-lg bg-surface-muted px-3 py-2">
                            <p className="text-xs text-brand-gray">Scheduled</p>
                            <p className="text-lg font-bold">{snapshot.headlineAgents}</p>
                        </div>
                        <div className="rounded-lg bg-surface-muted px-3 py-2">
                            <p className="text-xs text-brand-gray">Active</p>
                            <p className="text-lg font-bold text-status-green">{snapshot.active}</p>
                        </div>
                        <div className="rounded-lg bg-surface-muted px-3 py-2">
                            <p className="text-xs text-brand-gray">Paid leave</p>
                            <p className="text-lg font-bold">{snapshot.leave}</p>
                        </div>
                        <div className="rounded-lg bg-surface-muted px-3 py-2">
                            <p className="text-xs text-brand-gray">Sick</p>
                            <p className="text-lg font-bold text-status-amber">{snapshot.sick}</p>
                        </div>
                        <div className="rounded-lg bg-surface-muted px-3 py-2">
                            <p className="text-xs text-brand-gray">Late</p>
                            <p className="text-lg font-bold">{snapshot.late}</p>
                        </div>
                        <div className="rounded-lg bg-surface-muted px-3 py-2">
                            <p className="text-xs text-brand-gray">NCNS</p>
                            <p className="text-lg font-bold text-status-red">{snapshot.ncns}</p>
                        </div>
                    </div>
                </Card>
                <Card className="lg:col-span-1">
                    <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-gray">Leave liability (executive)</h2>
                    <p className="text-2xl font-bold text-foreground">{snapshot.leaveDays.toLocaleString()} days</p>
                    <p className="mt-1 text-sm text-brand-gray">
                        ≈ €{snapshot.leaveEur.toLocaleString()} @ €{DEMO_DEFAULTS.leaveValuePerDayEur}/day
                    </p>
                    <p className="mt-3 text-xs text-brand-gray">
                        Smart push savings MTD: €{snapshot.smartPushMtd.toLocaleString()} (low-volume leave consumption)
                    </p>
                </Card>
                <Card className="lg:col-span-1">
                    <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-gray">
                        Operational health ({periodShort(period)})
                    </h2>
                    <ul className="space-y-2 text-sm">
                        <li className="flex justify-between gap-2">
                            <span className="text-brand-gray">Avg FTE loss</span>
                            <span className="font-medium text-right text-status-green">{health.fte} · {health.fteVs}</span>
                        </li>
                        <li className="flex justify-between gap-2">
                            <span className="text-brand-gray">Unplanned shrinkage</span>
                            <span className="font-medium text-right text-status-green">{health.unplanned} · {health.unplannedVs}</span>
                        </li>
                        <li className="flex justify-between gap-2">
                            <span className="text-brand-gray">On-time rate</span>
                            <span className="font-medium text-right text-status-green">{health.onTime} · {health.onTimeVs}</span>
                        </li>
                        <li className="flex justify-between gap-2">
                            <span className="text-brand-gray">Missing minutes (total)</span>
                            <span className="font-medium text-right text-status-amber">{missingMin.total} min · €{missingMin.eurCost} cost</span>
                        </li>
                        <li className="flex justify-between gap-2">
                            <span className="text-brand-gray">Cost of unproductivity</span>
                            <span className="font-medium">{snapshot.costUnproductiveDay}</span>
                        </li>
                    </ul>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <h2 className="text-lg font-semibold">{slChartTitle}</h2>
                            <p className="text-xs text-brand-gray">Target line: {slTarget}% · 30-min intervals (demo)</p>
                        </div>
                        <Badge variant={belowTargetIntervals > 0 ? 'amber' : 'green'}>
                            {belowTargetIntervals > 0 ? `Below target ${belowTargetIntervals} intervals` : 'At/above target'}
                        </Badge>
                    </div>
                    {clientFilter === 'client-a' && (
                        <p className="mb-3 rounded-lg border border-surface-border bg-surface-muted px-3 py-2 text-xs text-foreground">
                            SLA penalty ticker: SL {snapshot.slAvg}. Penalty threshold 75%. Buffer 3.3 pts. (UC-5B)
                        </p>
                    )}
                    <ServiceLevelChart data={slData} target={slTarget} />
                </Card>
                <FteLossComparative key={`${clientFilter}-${period}`} teams={teams} />
            </div>

            <TeamLeadScorecard key={`${clientFilter}-${period}`} scores={tlScores} subtitle={tlSubtitle} />

            {/* Agent State Grid / Wallboard */}
            <Card>
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-gray">
                    Agent State Grid — Live Wallboard ({snapshot.headlineAgents} agents)
                </h2>
                <AgentStateGrid
                    active={snapshot.active}
                    leave={snapshot.leave}
                    sick={snapshot.sick}
                    late={snapshot.late}
                    ncns={snapshot.ncns}
                />
            </Card>

            {/* Cross-client FTE effectiveness table — only on "all" view */}
            {clientFilter === 'all' && (
                <Card padding={false}>
                    <div className="border-b border-surface-border p-4">
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-gray">Cross-Client FTE Effectiveness</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-surface-border text-left text-xs text-brand-gray">
                                    <th className="p-4 font-medium">Client</th>
                                    <th className="p-4 font-medium text-right">Teams</th>
                                    <th className="p-4 font-medium text-right">Nominal FTE</th>
                                    <th className="p-4 font-medium text-right">Effective FTE</th>
                                    <th className="p-4 font-medium text-right">FTE Loss</th>
                                    <th className="p-4 font-medium text-right">€/Day Loss</th>
                                    <th className="p-4 font-medium">Main Driver</th>
                                    <th className="p-4 font-medium text-right">Unplanned Shrink</th>
                                </tr>
                            </thead>
                            <tbody>
                                {CLIENT_FTE_TABLE.map((row) => (
                                    <tr key={row.client} className="border-b border-surface-border last:border-0 hover:bg-surface-muted/50">
                                        <td className="p-4 font-medium">{row.client}</td>
                                        <td className="p-4 text-right">{row.teams}</td>
                                        <td className="p-4 text-right">{row.nominal}</td>
                                        <td className="p-4 text-right font-semibold">{row.effective.toFixed(1)}</td>
                                        <td className="p-4 text-right">
                                            <span className={row.lossPct > 18 ? 'font-bold text-status-amber' : 'font-bold text-status-green'}>
                                                {row.lossPct.toFixed(1)}%
                                            </span>
                                        </td>
                                        <td className="p-4 text-right text-status-red font-medium">€{row.eurDay}</td>
                                        <td className="p-4 text-brand-gray">{row.mainDriver}</td>
                                        <td className="p-4 text-right">{row.unplanned.toFixed(1)}%</td>
                                    </tr>
                                ))}
                                <tr className="border-t-2 border-surface-border bg-surface-muted/30 font-semibold">
                                    <td className="p-4">Total</td>
                                    <td className="p-4 text-right">10</td>
                                    <td className="p-4 text-right">100</td>
                                    <td className="p-4 text-right">83.0</td>
                                    <td className="p-4 text-right text-status-amber">17.0%</td>
                                    <td className="p-4 text-right text-status-red">€{totalLossEurDay}</td>
                                    <td className="p-4" />
                                    <td className="p-4 text-right">10.1%</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="border-t border-surface-border bg-surface-muted/20 p-4">
                        <p className="text-sm">
                            <span className="font-medium">Total daily cost of unproductive time: €{totalLossEurDay}.</span>
                            {' '}Monthly projection: <span className="font-medium">€{(totalLossEurDay * 22).toLocaleString()}</span>.
                            {' '}If all teams matched Team C's 9% loss rate, you would save{' '}
                            <span className="font-semibold text-status-green">€{((totalLossEurDay - totalLossEurDay * 0.09 / 0.17) * 22).toLocaleString(undefined, { maximumFractionDigits: 0 })}/month</span>.
                        </p>
                    </div>
                </Card>
            )}

            {/* Unplanned shrinkage breakdown — client filter view */}
            {clientFilter !== 'all' && (
                <Card>
                    <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-gray">
                        Unplanned Shrinkage Breakdown — {snapshot.filterLabel}
                    </h2>
                    <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                        {shrinkageBreakdown.map((item) => (
                            <div key={item.label} className="rounded-lg border border-surface-border p-3 text-center">
                                <p className="text-xs text-brand-gray">{item.label}</p>
                                <p className={`text-xl font-bold ${item.pct > 2 ? 'text-status-red' : item.pct > 1 ? 'text-status-amber' : 'text-foreground'}`}>
                                    {item.pct.toFixed(1)}%
                                </p>
                            </div>
                        ))}
                    </div>
                    <p className="mt-3 text-xs text-brand-gray">
                        Total unplanned: <span className="font-semibold">
                            {shrinkageBreakdown.reduce((s, i) => s + i.pct, 0).toFixed(1)}%
                        </span>
                        {' '}(target 9%) — {clientFilter === 'client-a' ? 'driven by tardiness + sick in Team B' : 'within target range'}
                    </p>
                </Card>
            )}

            {/* Leave Liability Tracker (UC-5A) */}
            <Card>
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-gray">
                    Leave Liability Tracker{clientFilter !== 'all' ? ` — ${snapshot.filterLabel}` : ''}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-lg border border-surface-border p-3">
                        <p className="text-xs text-brand-gray">Total Unused Days</p>
                        <p className="text-2xl font-bold">{clientFilter === 'all' ? '960' : clientFilter === 'client-a' ? '576' : '384'}</p>
                        <p className="text-xs text-brand-gray mt-1">across {clientFilter === 'all' ? '100' : clientFilter === 'client-a' ? '60' : '40'} agents</p>
                    </div>
                    <div className="rounded-lg border border-status-amber/30 bg-status-amber/5 p-3">
                        <p className="text-xs text-brand-gray">Financial Value</p>
                        <p className="text-2xl font-bold text-status-amber">€{clientFilter === 'all' ? '34,906' : clientFilter === 'client-a' ? '20,944' : '13,962'}</p>
                        <p className="text-xs text-brand-gray mt-1">@ €36.36/day</p>
                    </div>
                    <div className="rounded-lg border border-surface-border p-3">
                        <p className="text-xs text-brand-gray">Projected Year-End Unused</p>
                        <p className="text-2xl font-bold">{clientFilter === 'all' ? '360' : clientFilter === 'client-a' ? '216' : '144'} days</p>
                        <p className="text-xs text-brand-gray mt-1">= €{clientFilter === 'all' ? '13,090' : clientFilter === 'client-a' ? '7,854' : '5,236'}</p>
                    </div>
                    <div className="rounded-lg border border-status-green/30 bg-status-green/5 p-3">
                        <p className="text-xs text-brand-gray">Smart Push Savings</p>
                        <p className="text-2xl font-bold text-status-green">€{clientFilter === 'all' ? '580' : clientFilter === 'client-a' ? '348' : '232'}</p>
                        <p className="text-xs text-brand-gray mt-1">this month — days consumed during low-volume</p>
                    </div>
                </div>
                <p className="mt-3 text-xs text-brand-gray">
                    No competitor proactively reduces leave liability. This is unique to meTru — Smart Leave Push triggered when volume drops ≥15%.
                </p>
            </Card>

            {/* Attrition Dashboard */}
            <Card>
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-gray">
                    Attrition & Retention{clientFilter !== 'all' ? ` — ${snapshot.filterLabel}` : ''}
                </h2>
                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                            <div className="rounded-lg border border-surface-border p-3 text-center">
                                <p className="text-xs text-brand-gray">Departures</p>
                                <p className="text-2xl font-bold">{attrition.departures}</p>
                                <p className="text-[10px] text-brand-gray">vs {attrition.lastMonth} last month</p>
                            </div>
                            <div className="rounded-lg border border-surface-border p-3 text-center">
                                <p className="text-xs text-brand-gray">Annualised</p>
                                <p className={`text-2xl font-bold ${attrition.annualised > 35 ? 'text-status-red' : attrition.annualised > 28 ? 'text-status-amber' : 'text-status-green'}`}>
                                    {attrition.annualised}%
                                </p>
                                <p className="text-[10px] text-brand-gray">{clientFilter !== 'all' ? 'vs 32% avg' : 'company avg'}</p>
                            </div>
                            <div className="rounded-lg border border-surface-border p-3 text-center">
                                <p className="text-xs text-brand-gray">Retention</p>
                                <p className="text-2xl font-bold text-status-green">{attrition.retention}%</p>
                            </div>
                            <div className="rounded-lg border border-surface-border p-3 text-center">
                                <p className="text-xs text-brand-gray">Avg Tenure</p>
                                <p className="text-2xl font-bold">{attrition.avgTenure}m</p>
                            </div>
                        </div>
                        <div className="rounded-lg bg-surface-muted/40 p-3 text-sm">
                            <div className="grid grid-cols-3 gap-2 text-center text-xs">
                                <div>
                                    <p className="text-brand-gray">Voluntary</p>
                                    <p className="text-lg font-semibold">{attrition.voluntary}</p>
                                </div>
                                <div>
                                    <p className="text-brand-gray">Performance</p>
                                    <p className="text-lg font-semibold text-status-amber">{attrition.performance}</p>
                                </div>
                                <div>
                                    <p className="text-brand-gray">End of Contract</p>
                                    <p className="text-lg font-semibold">{attrition.endOfContract}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border border-surface-border p-3 text-sm">
                            <span className="text-brand-gray">Cost of attrition this month</span>
                            <div className="text-right">
                                <span className="font-bold text-status-red">€{attrition.costThisMonth.toLocaleString()}</span>
                                <span className="ml-2 text-xs text-brand-gray">vs €{attrition.costLastMonth.toLocaleString()} last month</span>
                                {attrition.costThisMonth < attrition.costLastMonth && (
                                    <TrendingDown size={14} className="ml-1 inline text-status-green" />
                                )}
                            </div>
                        </div>
                        {(attrition as { note?: string }).note && (
                            <p className="rounded-lg border border-status-amber/30 bg-status-amber/5 px-3 py-2 text-xs text-foreground">
                                ⚠ {(attrition as { note?: string }).note}
                            </p>
                        )}
                    </div>
                    <div>
                        <p className="mb-3 text-xs font-medium text-brand-gray uppercase tracking-wide">Attrition by Tenure Band</p>
                        <div className="space-y-3">
                            {attrition.byTenure.filter(b => b.pct > 0 || b.band === '180+ days').map((band) => (
                                <div key={band.band}>
                                    <div className="mb-1 flex items-center justify-between text-xs">
                                        <span className="font-medium">{band.band}</span>
                                        <span className="text-brand-gray">{band.count} departures · {band.pct}%</span>
                                    </div>
                                    <div className="h-5 overflow-hidden rounded bg-surface-muted">
                                        <div
                                            className={`h-full rounded transition-all ${band.pct > 50 ? 'bg-status-red' : band.pct > 25 ? 'bg-status-amber' : 'bg-status-green'}`}
                                            style={{ width: `${band.pct}%` }}
                                        />
                                    </div>
                                    {band.label && <p className="mt-0.5 text-[10px] text-brand-gray">{band.label}</p>}
                                </div>
                            ))}
                            {attrition.byTenure.every(b => b.pct === 0) && (
                                <p className="text-sm text-brand-gray">No departures to show for this client.</p>
                            )}
                        </div>
                        {clientFilter === 'all' && (
                            <div className="mt-4 rounded-lg border border-status-amber/30 bg-status-amber/5 p-3 text-xs">
                                <span className="font-semibold">40% of departures occur in first 90 days</span> — signals onboarding process needs improvement.
                                Benchmark target: &lt;20% early attrition.
                            </div>
                        )}
                    </div>
                </div>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <AiFeatureLock title="Predictive Absence Risk" description="ML model identifies agents likely to be absent tomorrow based on patterns" />
                <AiFeatureLock title="Predictive Labour-Cost Forecast" description="AI projects next month labour costs based on volume trends and leave patterns" />
                <AiFeatureLock title="Attrition Early-Warning Scores" description="Risk scores highlighting agents most likely to resign in the next 90 days" />
            </div>
        </ExecutiveTemplate>
    )
}
