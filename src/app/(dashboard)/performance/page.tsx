'use client'

import { useMemo, useState } from 'react'
import { DashboardTemplate } from '@/components/templates/DashboardTemplate'
import { StatCard } from '@/components/molecules/StatCard'
import { TabGroup } from '@/components/molecules/TabGroup'
import { ServiceLevelChart } from '@/components/organisms/ServiceLevelChart'
import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import { AiFeatureLock } from '@/components/molecules/AiFeatureLock'
import { Spinner } from '@/components/atoms/Spinner'
import { usePerformanceDemo } from '@/lib/api/queries/usePerformanceDemo'

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
    effective: 4.05,
    totalLoss: 5.95,
    lossPercent: 59.5,
    dailyCost: 238,
    monthlyProjection: 5236,
    clientImpact: 'Client A SL at 68% (target 80%)',
}

/** Client B program teams (chat + voice) — matches seeded FTE rows */
function isClientBTeam(teamId: string) {
    return ['team-e', 'team-h', 'team-i', 'team-j'].includes(teamId)
}

export default function PerformancePage() {
    const [activeTeam, setActiveTeam] = useState('team-b')
    const { data, isPending, isError } = usePerformanceDemo()

    const showFteLossDetail = activeTeam === 'team-b'

    const slData = useMemo(() => {
        if (!data) return []
        return isClientBTeam(activeTeam) ? data.slByClient['client-b'] : data.slByClient['client-a']
    }, [data, activeTeam])

    const slTarget = slData[0]?.target ?? 80

    if (isPending) {
        return (
            <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
                <Spinner size={32} />
                <p className="text-sm text-brand-gray">Loading performance data…</p>
            </div>
        )
    }

    if (isError || !data) {
        return (
            <div className="flex min-h-[40vh] flex-col items-center justify-center gap-2 text-center">
                <p className="font-medium">Could not load performance demo data.</p>
                <p className="text-sm text-brand-gray">Ensure Supabase is running and migrations 018–019 are applied.</p>
            </div>
        )
    }

    const liveStats = data.perfLiveStats[activeTeam] ?? data.perfLiveStats['team-a']
    if (!liveStats) {
        return (
            <div className="flex min-h-[40vh] flex-col items-center justify-center gap-2 text-center">
                <p className="font-medium">Performance stats incomplete.</p>
            </div>
        )
    }

    return (
        <DashboardTemplate
            title="Performance & Productivity"
            statCards={
                <>
                    <StatCard label="Service Level" value={liveStats.sl} variant={liveStats.slVariant} />
                    <StatCard label="Occupancy" value={liveStats.occupancy} variant={liveStats.occVariant} />
                    <StatCard label="AHT Live" value={liveStats.aht} variant={liveStats.ahtVariant} />
                    <StatCard label="Adherence" value={liveStats.adherence} variant={liveStats.adhVariant} />
                    <StatCard label="ACW Live" value={liveStats.acw} variant={liveStats.acwVariant} />
                    <StatCard label="FTE Loss" value={liveStats.fteLoss} variant={liveStats.fteVariant} />
                </>
            }
        >
            <TabGroup tabs={data.teamTabs} activeTab={activeTeam} onChange={setActiveTeam} className="flex-wrap" />

            <Card className="mt-6">
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
                                <tr
                                    key={t.name}
                                    className={`border-b border-surface-border last:border-0 ${t.name === 'Team B' ? 'bg-status-red/5' : ''}`}
                                >
                                    <td className="p-3 font-medium">
                                        {t.name} {t.loss > 30 && <Badge variant="red">CRITICAL</Badge>}
                                    </td>
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

            {showFteLossDetail && (
                <Card className="mt-6 border-status-red/30">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Team B — FTE Loss Breakdown (Live)</h2>
                        <Badge variant="red">59.5% Loss — Auto-ticket triggered</Badge>
                    </div>
                    <div className="space-y-2 font-mono text-sm">
                        <div className="flex justify-between border-b border-surface-border pb-2">
                            <span>Nominal FTEs:</span>
                            <span className="font-bold">{teamBFteLoss.nominal.toFixed(1)}</span>
                        </div>
                        {teamBFteLoss.categories.map((cat) => (
                            <div key={cat.label} className="flex justify-between text-status-red">
                                <span>{cat.label}</span>
                                <span>-{cat.loss.toFixed(2)} FTE</span>
                            </div>
                        ))}
                        <div className="flex justify-between border-t border-surface-border pt-2 text-lg font-bold">
                            <span>EFFECTIVE FTEs:</span>
                            <span className="text-status-red">{teamBFteLoss.effective.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>DAILY COST IMPACT:</span>
                            <span className="font-bold">€{teamBFteLoss.dailyCost}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>MONTHLY PROJECTION:</span>
                            <span className="font-bold">€{teamBFteLoss.monthlyProjection.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-status-red">
                            <span>CLIENT IMPACT:</span>
                            <span className="font-bold">{teamBFteLoss.clientImpact}</span>
                        </div>
                    </div>

                    <div className="mt-4 rounded-lg bg-surface-muted p-4">
                        <h3 className="mb-2 text-sm font-semibold">PRIORITY FIX ORDER:</h3>
                        <ol className="list-inside list-decimal space-y-1 text-sm">
                            {teamBFteLoss.categories
                                .sort((a, b) => b.loss - a.loss)
                                .map((cat, i) => (
                                    <li key={i}>
                                        <span className="font-medium">{cat.label.split('(')[0].trim()}</span>
                                        <span className="text-brand-gray">
                                            {' '}
                                            ({cat.loss.toFixed(2)} FTE) → {cat.cause}
                                        </span>
                                    </li>
                                ))}
                        </ol>
                    </div>
                </Card>
            )}

            <Card className="mt-6">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-gray">
                    Service Level — Today&apos;s 30-min Intervals (
                    {isClientBTeam(activeTeam) ? 'Client B — 90% < 60s' : 'Client A — 80/20'})
                </h2>
                <ServiceLevelChart data={slData} target={slTarget} />
            </Card>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <AiFeatureLock title="AI Behaviour Analytics" description="Deep-learning model identifies agent behaviour patterns linked to underperformance" />
                <AiFeatureLock title="AI Coaching Recommendations" description="Automated coaching suggestions based on QA scores, AHT trends, and peer benchmarks" />
                <AiFeatureLock title="Predictive Performance-Risk Alerts" description="Flags agents at risk of SLA breach 2 hours before it happens" />
            </div>
        </DashboardTemplate>
    )
}
