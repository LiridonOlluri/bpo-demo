'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
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
import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import { AiFeatureLock } from '@/components/molecules/AiFeatureLock'
import { TabGroup } from '@/components/molecules/TabGroup'

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
                            <span className="font-medium text-status-green text-right">
                                {health.fte} · {health.fteVs}
                            </span>
                        </li>
                        <li className="flex justify-between gap-2">
                            <span className="text-brand-gray">Unplanned shrinkage</span>
                            <span className="font-medium text-status-green text-right">
                                {health.unplanned} · {health.unplannedVs}
                            </span>
                        </li>
                        <li className="flex justify-between gap-2">
                            <span className="text-brand-gray">On-time rate</span>
                            <span className="font-medium text-status-green text-right">
                                {health.onTime} · {health.onTimeVs}
                            </span>
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

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <AiFeatureLock title="Predictive Absence Risk" description="ML model identifies agents likely to be absent tomorrow based on patterns" />
                <AiFeatureLock title="Predictive Labour-Cost Forecast" description="AI projects next month labour costs based on volume trends and leave patterns" />
                <AiFeatureLock title="Attrition Early-Warning Scores" description="Risk scores highlighting agents most likely to resign in the next 90 days" />
            </div>
        </ExecutiveTemplate>
    )
}
