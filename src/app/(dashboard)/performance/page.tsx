'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRole } from '@/hooks/useRole'
import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import { StatCard } from '@/components/molecules/StatCard'
import { TabGroup } from '@/components/molecules/TabGroup'
import { AiFeatureLock } from '@/components/molecules/AiFeatureLock'
import { ServiceLevelChart } from '@/components/organisms/ServiceLevelChart'
import { Spinner } from '@/components/atoms/Spinner'
import { usePerformanceDemo } from '@/lib/api/queries/usePerformanceDemo'
import { TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp } from 'lucide-react'

// ─── L1 Performance — own data ────────────────────────────────────────────────
const L1_METRICS = {
    qa: { current: 85, trend: [78, 80, 82, 85], label: 'Improving ↑' },
    aht: { actual: '5.2 min', target: '5.0 min', overBy: '+0.2 min' },
    acw: { actual: '48 sec', target: '45 sec', overBy: '+3 sec' },
    fcr: { current: '78%', target: '80%' },
    occupancy: { current: '81%', target: '80%' },
    adherence: { current: '91%', trend: [88, 90, 90, 91], label: 'Stable' },
}

const L1_COACHING_HISTORY = [
    {
        date: '2026-03-28', category: 'Adherence', rootCause: 'Knowledge', coachingType: 'One-on-One',
        actionTaken: 'Agent briefed on schedule adherence importance and AUX code policy.',
        phrases: [],
        followUpDate: '2026-04-04', outcome: 'Pending',
    },
    {
        date: '2026-03-15', category: 'Productivity', rootCause: 'Skill', coachingType: 'Written',
        actionTaken: 'AHT coaching: call structuring guide sent. Timing benchmarks explained.',
        phrases: [],
        followUpDate: '2026-03-22', outcome: 'Improved',
    },
]

function MiniSparkline({ values }: { values: number[] }) {
    const min = Math.min(...values)
    const max = Math.max(...values)
    const range = max - min || 1
    const w = 80, h = 28
    const pts = values.map((v, i) => {
        const x = (i / (values.length - 1)) * w
        const y = h - ((v - min) / range) * (h - 4) - 2
        return `${x},${y}`
    }).join(' ')
    return (
        <svg width={w} height={h} className="overflow-visible">
            <polyline points={pts} fill="none" stroke="#16a34a" strokeWidth="2" strokeLinejoin="round" />
            {values.map((v, i) => {
                const x = (i / (values.length - 1)) * w
                const y = h - ((v - min) / range) * (h - 4) - 2
                return <circle key={i} cx={x} cy={y} r="2.5" fill="#16a34a" />
            })}
        </svg>
    )
}

function L1Performance() {
    const [coachExpanded, setCoachExpanded] = useState<number | null>(null)

    return (
        <div className="space-y-5">
            {/* KPI Metric Cards */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                <StatCard label="QA Score" value={`${L1_METRICS.qa.current}%`} variant="green" trendValue={L1_METRICS.qa.label} />
                <StatCard label="AHT" value={L1_METRICS.aht.actual} variant="amber" trendValue={`Target: ${L1_METRICS.aht.target}`} />
                <StatCard label="ACW" value={L1_METRICS.acw.actual} variant="amber" trendValue={`Target: ${L1_METRICS.acw.target}`} />
                <StatCard label="FCR" value={L1_METRICS.fcr.current} variant="amber" trendValue={`Target: ${L1_METRICS.fcr.target}`} />
                <StatCard label="Occupancy" value={L1_METRICS.occupancy.current} variant="green" trendValue={`Target: ${L1_METRICS.occupancy.target}`} />
                <StatCard label="Adherence" value={L1_METRICS.adherence.current} variant="green" trendValue={L1_METRICS.adherence.label} />
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
                {/* QA Trend */}
                <Card>
                    <h2 className="mb-3 text-sm font-semibold">QA Score — 3-Month Trend</h2>
                    <div className="flex items-end gap-4">
                        <div>
                            <p className="text-3xl font-bold text-status-green">{L1_METRICS.qa.current}%</p>
                            <p className="text-xs text-brand-gray mt-0.5">{L1_METRICS.qa.label}</p>
                        </div>
                        <MiniSparkline values={L1_METRICS.qa.trend} />
                    </div>
                    <div className="mt-3 grid grid-cols-4 gap-2 text-xs text-center">
                        {['Dec', 'Jan', 'Feb', 'Mar'].map((m, i) => (
                            <div key={m} className="rounded border border-surface-border p-1.5">
                                <p className="text-brand-gray">{m}</p>
                                <p className="font-bold">{L1_METRICS.qa.trend[i]}%</p>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Schedule Adherence Trend */}
                <Card>
                    <h2 className="mb-3 text-sm font-semibold">Schedule Adherence — Trend</h2>
                    <div className="flex items-end gap-4">
                        <div>
                            <p className="text-3xl font-bold text-status-green">{L1_METRICS.adherence.current}</p>
                            <p className="text-xs text-brand-gray mt-0.5">{L1_METRICS.adherence.label}</p>
                        </div>
                        <MiniSparkline values={L1_METRICS.adherence.trend} />
                    </div>
                    <div className="mt-3 grid grid-cols-4 gap-2 text-xs text-center">
                        {['Dec', 'Jan', 'Feb', 'Mar'].map((m, i) => (
                            <div key={m} className="rounded border border-surface-border p-1.5">
                                <p className="text-brand-gray">{m}</p>
                                <p className="font-bold">{L1_METRICS.adherence.trend[i]}%</p>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Coaching History — TL phrases visible here */}
            <Card padding={false}>
                <div className="border-b border-surface-border p-4">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-gray">
                        Coaching History — {L1_COACHING_HISTORY.length} session{L1_COACHING_HISTORY.length !== 1 ? 's' : ''} this month
                    </h2>
                </div>
                <div className="divide-y divide-surface-border">
                    {L1_COACHING_HISTORY.map((entry, i) => (
                        <div key={i} className="p-4">
                            <button
                                type="button"
                                onClick={() => setCoachExpanded(coachExpanded === i ? null : i)}
                                className="flex w-full items-center gap-3 text-left"
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                                        <span className="text-xs font-medium">{entry.date}</span>
                                        <Badge variant={entry.category === 'Productivity' ? 'amber' : entry.category === 'Quality' ? 'blue' : 'red'}>
                                            {entry.category}
                                        </Badge>
                                        <span className={`rounded border px-1.5 py-0.5 text-[10px] font-medium ${entry.rootCause === 'Knowledge' ? 'text-blue-600 bg-blue-50 border-blue-200' : entry.rootCause === 'Skill' ? 'text-green-700 bg-green-50 border-green-200' : 'text-red-700 bg-red-50 border-red-200'}`}>
                                            {entry.rootCause}
                                        </span>
                                        <span className="text-[11px] text-brand-gray">{entry.coachingType}</span>
                                    </div>
                                    <p className="text-xs text-brand-gray truncate">{entry.actionTaken}</p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <Badge variant={entry.outcome === 'Improved' ? 'green' : entry.outcome === 'Pending' ? 'amber' : 'grey'}>{entry.outcome}</Badge>
                                    {coachExpanded === i ? <ChevronUp size={14} className="text-brand-gray" /> : <ChevronDown size={14} className="text-brand-gray" />}
                                </div>
                            </button>

                            {coachExpanded === i && (
                                <div className="mt-3 space-y-2 rounded-lg bg-surface-muted/40 p-3 text-xs">
                                    <p><span className="font-medium">Action taken:</span> {entry.actionTaken}</p>
                                    {entry.phrases.length > 0 && (
                                        <div>
                                            <p className="font-medium mb-1">Specific phrases from TL:</p>
                                            <ul className="space-y-1">
                                                {entry.phrases.map((p, j) => (
                                                    <li key={j} className="rounded border border-surface-border bg-white px-2 py-1">{p}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    <p><span className="font-medium">Follow-up date:</span> {entry.followUpDate}</p>
                                    <p><span className="font-medium">Outcome:</span> {entry.outcome}</p>
                                </div>
                            )}
                        </div>
                    ))}
                    {L1_COACHING_HISTORY.length === 0 && (
                        <p className="p-4 text-sm text-brand-gray text-center">No coaching sessions recorded this month.</p>
                    )}
                </div>
            </Card>
        </div>
    )
}

// ─── L2 Performance — team KPIs, % only, NO EUR ───────────────────────────────
const L2_FTE_TABLE = [
    { team: 'Team A (mine)', nominal: 10, effective: 8.7, loss: 13, main: 'AHT overrun', trend: 'up' as const },
    { team: 'Team B', nominal: 10, effective: 5.9, loss: 41, main: 'AHT overrun', trend: 'down' as const },
    { team: 'Team C', nominal: 10, effective: 9.1, loss: 9, main: '—', trend: 'stable' as const },
    { team: 'Team D', nominal: 10, effective: 8.4, loss: 16, main: 'Adherence', trend: 'up' as const },
    { team: 'Team E', nominal: 10, effective: 8.8, loss: 12, main: '—', trend: 'stable' as const },
    { team: 'Team F', nominal: 10, effective: 7.2, loss: 28, main: 'Adherence', trend: 'down' as const },
    { team: 'Team G', nominal: 10, effective: 9.0, loss: 10, main: 'ACW', trend: 'up' as const },
    { team: 'Team H', nominal: 10, effective: 8.0, loss: 20, main: 'ACW overrun', trend: 'stable' as const },
    { team: 'Team I', nominal: 10, effective: 9.2, loss: 8, main: '—', trend: 'up' as const },
    { team: 'Team J', nominal: 10, effective: 8.5, loss: 15, main: 'Tardiness', trend: 'stable' as const },
]

const L2_INTERVALS = [
    { time: '07:00', fteLoss: 8 }, { time: '07:30', fteLoss: 12 }, { time: '08:00', fteLoss: 10 },
    { time: '08:30', fteLoss: 9 }, { time: '09:00', fteLoss: 11 }, { time: '09:30', fteLoss: 14 },
    { time: '10:00', fteLoss: 18 }, { time: '10:30', fteLoss: 22 }, { time: '11:00', fteLoss: 41 },
    { time: '11:30', fteLoss: 38 }, { time: '12:00', fteLoss: 30 }, { time: '12:30', fteLoss: 25 },
    { time: '13:00', fteLoss: 20 }, { time: '13:30', fteLoss: 16 },
]

function TrendIcon({ trend }: { trend: 'up' | 'down' | 'stable' }) {
    return trend === 'up' ? <TrendingUp size={13} className="text-status-green" />
        : trend === 'down' ? <TrendingDown size={13} className="text-status-red" />
        : <Minus size={13} className="text-brand-gray" />
}

function L2Performance() {
    const { data, isPending } = usePerformanceDemo()
    const [activeTeam, setActiveTeam] = useState('team-a')

    const slData = useMemo(() => {
        if (!data) return []
        return data.slByClient?.['client-a'] ?? []
    }, [data])

    return (
        <div className="space-y-5">
            {/* Team KPI cards */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                <StatCard label="SL Contribution" value="78%" variant="amber" trendValue="Target 80%" />
                <StatCard label="Occupancy" value="81%" variant="green" trendValue="Target 80%" />
                <StatCard label="AHT (team avg)" value="6.1 min" variant="amber" trendValue="Target 5.0 min" />
                <StatCard label="Adherence" value="87%" variant="green" trendValue="Target 85%" />
                <StatCard label="ACW" value="52 sec" variant="amber" trendValue="Target 45 sec" />
                <StatCard label="FTE Loss %" value="41%" variant="red" trendValue="↓ Worsening" />
            </div>

            <div className="rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700 font-medium">
                Level 2 view: percentages and hours only — no EUR values anywhere on this page.
            </div>

            {/* All-Teams Comparison — % only, NO EUR */}
            <Card padding={false}>
                <div className="flex items-center justify-between border-b border-surface-border p-4">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-gray">All-Teams FTE Loss Comparison</h2>
                    <span className="text-[10px] rounded border border-green-200 bg-green-50 px-2 py-0.5 text-green-700 font-medium">% only · NO EUR</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-surface-border text-left text-xs text-brand-gray">
                                <th className="p-3 font-medium">Team</th>
                                <th className="p-3 font-medium text-right">Nominal FTE</th>
                                <th className="p-3 font-medium text-right">Effective FTE</th>
                                <th className="p-3 font-medium text-right">Loss %</th>
                                <th className="p-3 font-medium">Main Driver</th>
                                <th className="p-3 font-medium text-center">Trend</th>
                            </tr>
                        </thead>
                        <tbody>
                            {L2_FTE_TABLE.map((t) => (
                                <tr key={t.team} className={`border-b border-surface-border last:border-0 hover:bg-surface-muted/50 ${t.team.includes('mine') ? 'bg-blue-50/30 font-medium' : ''}`}>
                                    <td className="p-3">
                                        {t.team} {t.team.includes('mine') && <Badge variant="blue">My Team</Badge>}
                                    </td>
                                    <td className="p-3 text-right">{t.nominal}</td>
                                    <td className="p-3 text-right">{t.effective}</td>
                                    <td className="p-3 text-right">
                                        <span className={t.loss > 30 ? 'font-bold text-status-red' : t.loss > 20 ? 'text-status-amber' : 'text-status-green'}>
                                            {t.loss}%
                                        </span>
                                    </td>
                                    <td className="p-3 text-brand-gray text-xs">{t.main}</td>
                                    <td className="p-3">
                                        <div className="flex items-center justify-center gap-1">
                                            <TrendIcon trend={t.trend} />
                                            <span className="text-[11px] text-brand-gray">
                                                {t.trend === 'up' ? 'Improving' : t.trend === 'down' ? 'Worsening' : 'Stable'}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Own Team FTE Loss by Category */}
            <Card>
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-sm font-semibold">My Team — FTE Loss Breakdown by Category</h2>
                    <Badge variant="red">41% Total Loss</Badge>
                </div>
                <div className="space-y-2">
                    {[
                        { label: 'AHT overrun (6.8 vs 5.0)', loss: 2.7, priority: 1 },
                        { label: 'Schedule adherence gap (83% vs 92%)', loss: 1.07, priority: 2 },
                        { label: 'Unplanned absence (1 NCNS)', loss: 1.0, priority: 3 },
                        { label: 'ACW overrun (78s vs 45s)', loss: 0.9, priority: 4 },
                        { label: 'Break overruns', loss: 0.21, priority: 5 },
                        { label: 'Tardiness', loss: 0.07, priority: 6 },
                    ].map((cat) => (
                        <div key={cat.label}>
                            <div className="flex items-center justify-between text-xs mb-1">
                                <span className="font-medium">#{cat.priority} {cat.label}</span>
                                <span className="font-bold text-status-red">-{cat.loss.toFixed(2)} FTE</span>
                            </div>
                            <div className="h-3 rounded-full bg-surface-muted overflow-hidden">
                                <div className="h-full rounded-full bg-status-red/70" style={{ width: `${(cat.loss / 2.7) * 100}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
                <p className="mt-3 text-xs text-brand-gray">
                    Priority fix: start with AHT overrun → coaching tickets already created for Agent #7 and Agent #33.
                </p>
            </Card>

            {/* Own Team Interval Drill-Down */}
            <Card padding={false}>
                <div className="border-b border-surface-border p-4">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-gray">My Team — FTE Loss per 30-min Interval</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-surface-border text-left text-xs text-brand-gray">
                                <th className="p-3 font-medium">Interval</th>
                                <th className="p-3 font-medium text-right">FTE Loss %</th>
                                <th className="p-3 font-medium">Severity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {L2_INTERVALS.map((r) => (
                                <tr key={r.time} className={`border-b border-surface-border last:border-0 ${r.fteLoss === 41 ? 'bg-red-50/40' : ''}`}>
                                    <td className="p-3 font-medium">{r.time}</td>
                                    <td className="p-3 text-right">
                                        <span className={r.fteLoss > 30 ? 'font-bold text-status-red' : r.fteLoss > 20 ? 'text-status-amber' : ''}>
                                            {r.fteLoss}%
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        {r.fteLoss > 30 ? <Badge variant="red">Critical</Badge>
                                            : r.fteLoss > 20 ? <Badge variant="amber">High</Badge>
                                            : r.fteLoss > 12 ? <Badge variant="blue">Medium</Badge>
                                            : <Badge variant="grey">Low</Badge>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* SL chart */}
            {isPending ? (
                <Card><div className="flex justify-center py-8"><Spinner /></div></Card>
            ) : slData.length > 0 ? (
                <Card>
                    <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-gray">Service Level — 30-min Intervals (Own Team Contribution)</h2>
                    <ServiceLevelChart data={slData} target={80} />
                </Card>
            ) : null}

            {/* AI Features greyed */}
            <div className="grid gap-4 sm:grid-cols-3">
                <AiFeatureLock title="Behaviour Analytics" description="Deep-learning analysis of agent behaviour patterns and coaching effectiveness" />
                <AiFeatureLock title="Coaching Recommendations" description="AI suggests optimal coaching approach based on KSB patterns and outcomes" />
                <AiFeatureLock title="Performance-Risk Alerts" description="Early warning system for agents at risk 2h before SL breach" />
            </div>

            <div className="text-center">
                <Link href="/coaching" className="text-sm text-brand-primary hover:underline">
                    → Go to Coaching Kanban to action tickets
                </Link>
            </div>
        </div>
    )
}

// ─── L3+ (existing behavior) ──────────────────────────────────────────────────
const teamBFteLoss = {
    nominal: 10.0,
    categories: [
        { label: 'AHT overrun (6.8 min vs 5.0 target)', loss: 2.7, cause: '4 agents handling new product enquiries without training' },
        { label: 'ACW overrun (78s vs 45s target)', loss: 0.9, cause: 'CRM form has new mandatory field, slowing wrap-up' },
        { label: 'Break overruns (avg +7 min)', loss: 0.21, cause: 'Extended break patterns in morning shift' },
        { label: 'Tardiness (2 agents, avg 12 min)', loss: 0.07, cause: 'Recurring late arrivals' },
        { label: 'Adherence gaps (83% vs 92% target)', loss: 1.07, cause: '3 agents in extended personal AUX' },
        { label: 'Unplanned absence (1 agent sick)', loss: 1.0, cause: 'Already covered by OT request' },
    ],
    effective: 4.05, totalLoss: 5.95, lossPercent: 59.5,
    dailyCost: 238, monthlyProjection: 5236,
    clientImpact: 'Client A SL at 68% (target 80%)',
}

function L3Performance() {
    const [activeTeam, setActiveTeam] = useState('team-b')
    const { data, isPending, isError } = usePerformanceDemo()

    const slData = useMemo(() => {
        if (!data) return []
        const isB = ['team-e', 'team-h', 'team-i', 'team-j'].includes(activeTeam)
        return isB ? data.slByClient['client-b'] : data.slByClient['client-a']
    }, [data, activeTeam])

    if (isPending) return <div className="flex min-h-[40vh] items-center justify-center"><Spinner size={32} /></div>
    if (isError || !data) return <div className="flex min-h-[40vh] items-center justify-center text-center"><p>Could not load performance data.</p></div>

    const liveStats = data.perfLiveStats[activeTeam] ?? data.perfLiveStats['team-a']
    const slTarget = slData[0]?.target ?? 80

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-6">
                <StatCard label="Service Level" value={liveStats.sl} variant={liveStats.slVariant} />
                <StatCard label="Occupancy" value={liveStats.occupancy} variant={liveStats.occVariant} />
                <StatCard label="AHT Live" value={liveStats.aht} variant={liveStats.ahtVariant} />
                <StatCard label="Adherence" value={liveStats.adherence} variant={liveStats.adhVariant} />
                <StatCard label="ACW Live" value={liveStats.acw} variant={liveStats.acwVariant} />
                <StatCard label="FTE Loss" value={liveStats.fteLoss} variant={liveStats.fteVariant} />
            </div>
            <TabGroup tabs={data.teamTabs} activeTab={activeTeam} onChange={setActiveTeam} className="flex-wrap" />
            <Card>
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-gray">FTE Loss — All Teams (Live)</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-surface-border text-left text-xs text-brand-gray">
                                <th className="p-3 font-medium">Team</th>
                                <th className="p-3 font-medium text-right">Nominal</th>
                                <th className="p-3 font-medium text-right">Effective</th>
                                <th className="p-3 font-medium text-right">Loss %</th>
                                <th className="p-3 font-medium text-right">Cost/Day</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.fteTableRows.map((t) => (
                                <tr key={t.name} className={`border-b border-surface-border last:border-0 ${t.name === 'Team B' ? 'bg-status-red/5' : ''}`}>
                                    <td className="p-3 font-medium">{t.name} {t.loss > 30 && <Badge variant="red">CRITICAL</Badge>}</td>
                                    <td className="p-3 text-right">{t.nominal.toFixed(1)}</td>
                                    <td className="p-3 text-right font-semibold">{t.effective.toFixed(2)}</td>
                                    <td className="p-3 text-right">
                                        <span className={t.loss > 30 ? 'font-bold text-status-red' : t.loss > 20 ? 'text-status-amber' : ''}>
                                            {t.loss}%
                                        </span>
                                    </td>
                                    <td className="p-3 text-right">€{t.cost}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
            {activeTeam === 'team-b' && (
                <Card className="border-status-red/30">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Team B — FTE Loss Breakdown</h2>
                        <Badge variant="red">59.5% Loss</Badge>
                    </div>
                    <div className="space-y-1.5 font-mono text-sm">
                        <div className="flex justify-between border-b border-surface-border pb-2">
                            <span>Nominal FTEs:</span><span className="font-bold">{teamBFteLoss.nominal.toFixed(1)}</span>
                        </div>
                        {teamBFteLoss.categories.map((cat) => (
                            <div key={cat.label} className="flex justify-between text-status-red">
                                <span>{cat.label}</span><span>-{cat.loss.toFixed(2)} FTE</span>
                            </div>
                        ))}
                        <div className="flex justify-between border-t border-surface-border pt-2 text-lg font-bold">
                            <span>EFFECTIVE FTEs:</span><span className="text-status-red">{teamBFteLoss.effective.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between"><span>DAILY COST:</span><span className="font-bold">€{teamBFteLoss.dailyCost}</span></div>
                        <div className="flex justify-between"><span>MONTHLY PROJECTION:</span><span className="font-bold">€{teamBFteLoss.monthlyProjection.toLocaleString()}</span></div>
                    </div>
                </Card>
            )}
            <Card>
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-gray">Service Level — 30-min Intervals</h2>
                <ServiceLevelChart data={slData} target={slTarget} />
            </Card>
            <div className="grid gap-4 sm:grid-cols-3">
                <AiFeatureLock title="AI Behaviour Analytics" description="Deep-learning model identifies agent behaviour patterns" />
                <AiFeatureLock title="AI Coaching Recommendations" description="Automated coaching suggestions based on trends" />
                <AiFeatureLock title="Predictive Performance-Risk Alerts" description="Flags agents at risk of SLA breach 2h ahead" />
            </div>
        </div>
    )
}

// ─── Page root ────────────────────────────────────────────────────────────────
export default function PerformancePage() {
    const { level } = useRole()

    const subtitle =
        level === 1 ? 'My QA score · AHT · ACW · FCR · occupancy · adherence · coaching history'
        : level === 2 ? 'Team KPIs · all-teams comparison (% only) · FTE loss breakdown · interval drill-down'
        : 'Performance & productivity · FTE loss analytics · all teams'

    return (
        <div className="space-y-1">
            <div className="mb-4">
                <h1 className="text-xl font-bold tracking-tight">Performance</h1>
                <p className="text-sm text-brand-gray">{subtitle}</p>
            </div>
            {level === 1 ? <L1Performance /> : level === 2 ? <L2Performance /> : <L3Performance />}
        </div>
    )
}
