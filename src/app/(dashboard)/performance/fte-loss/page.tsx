'use client'

import { useState } from 'react'
import { DashboardTemplate } from '@/components/templates/DashboardTemplate'
import { StatCard } from '@/components/molecules/StatCard'
import { TabGroup } from '@/components/molecules/TabGroup'
import { FteLossWidget } from '@/components/organisms/FteLossWidget'
import { FteLossComparative } from '@/components/organisms/FteLossComparative'
import { ServiceLevelChart } from '@/components/organisms/ServiceLevelChart'
import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import { Spinner } from '@/components/atoms/Spinner'
import { usePerformanceDemo } from '@/lib/api/queries/usePerformanceDemo'

/* Interval drill-down for Team B worst case (UC-3D) */
const TEAM_B_INTERVALS = [
    { time: '07:00', fteLoss: 28, agents: 10, onAux: 1, comment: '' },
    { time: '07:30', fteLoss: 32, agents: 10, onAux: 1, comment: '' },
    { time: '08:00', fteLoss: 35, agents: 10, onAux: 2, comment: '' },
    { time: '08:30', fteLoss: 40, agents: 10, onAux: 2, comment: '' },
    { time: '09:00', fteLoss: 48, agents: 10, onAux: 2, comment: '' },
    { time: '09:30', fteLoss: 52, agents: 10, onAux: 3, comment: '' },
    { time: '10:00', fteLoss: 55, agents: 10, onAux: 3, comment: '' },
    { time: '10:30', fteLoss: 58, agents: 10, onAux: 4, comment: 'Peak AUX — worst interval' },
    { time: '11:00', fteLoss: 56, agents: 10, onAux: 3, comment: '' },
    { time: '11:30', fteLoss: 53, agents: 10, onAux: 3, comment: '' },
    { time: '12:00', fteLoss: 50, agents: 10, onAux: 2, comment: '' },
    { time: '12:30', fteLoss: 47, agents: 10, onAux: 2, comment: '' },
    { time: '13:00', fteLoss: 45, agents: 10, onAux: 2, comment: '' },
    { time: '13:30', fteLoss: 44, agents: 10, onAux: 2, comment: '' },
    { time: '14:00', fteLoss: 42, agents: 10, onAux: 2, comment: '' },
    { time: '14:30', fteLoss: 40, agents: 10, onAux: 2, comment: '' },
]

/* Build service level chart from interval FTE loss (inverse relationship) */
const TEAM_B_SL_INTERVALS = TEAM_B_INTERVALS.map((d) => ({
    time: d.time,
    serviceLevel: Math.max(55, 85 - (d.fteLoss - 30) * 0.9),
    target: 80,
}))

export default function FteLossPage() {
    const [activeTeam, setActiveTeam] = useState('team-b')
    const { data, isPending, isError } = usePerformanceDemo()

    if (isPending) {
        return (
            <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
                <Spinner size={32} />
                <p className="text-sm text-brand-gray">Loading FTE data…</p>
            </div>
        )
    }

    if (isError || !data) {
        return (
            <div className="flex min-h-[40vh] flex-col items-center justify-center gap-2 text-center">
                <p className="font-medium">Could not load FTE loss data.</p>
                <p className="text-sm text-brand-gray">Ensure Supabase is running and migrations 018–019 are applied.</p>
            </div>
        )
    }

    const selectedTeam = data.fteTeams.find((t) => t.teamId === activeTeam) ?? data.fteTeams[1]

    if (!selectedTeam) {
        return (
            <div className="flex min-h-[40vh] flex-col items-center justify-center gap-2 text-center">
                <p className="font-medium">No team data available.</p>
            </div>
        )
    }

    const showInterval = selectedTeam.teamId === 'team-b'

    return (
        <DashboardTemplate
            title="FTE Loss Analysis"
            statCards={
                <>
                    <StatCard label="Nominal FTEs" value={selectedTeam.nominalFtes} />
                    <StatCard label="Effective FTEs" value={selectedTeam.effectiveFtes} variant={selectedTeam.lossPercentage > 25 ? 'red' : 'green'} />
                    <StatCard
                        label="Total Loss"
                        value={`${selectedTeam.lossPercentage.toFixed(1)}%`}
                        variant={selectedTeam.lossPercentage > 25 ? 'red' : selectedTeam.lossPercentage > 15 ? 'amber' : 'green'}
                        trend={selectedTeam.trend === 'worsening' ? 'down' : selectedTeam.trend === 'improving' ? 'up' : 'flat'}
                        trendValue={selectedTeam.trend}
                    />
                    <StatCard label="Daily Cost Impact" value={`€${selectedTeam.dailyCostImpact.toLocaleString()}`} variant="red" />
                </>
            }
        >
            <TabGroup tabs={data.teamTabs} activeTab={activeTeam} onChange={setActiveTeam} className="flex-wrap" />

            <div className="mt-6 space-y-8">
                <FteLossWidget data={selectedTeam} />

                {/* 30-min interval drill-down — Team B UC-3D */}
                {showInterval && (
                    <Card>
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold">30-Min Interval Drill-Down — Team B</h2>
                                <p className="text-xs text-brand-gray">Worst interval: <strong>10:30–11:00 (58% FTE loss)</strong> — 4 agents in extended personal AUX during peak + 1 agent AHT 9.2 min</p>
                            </div>
                            <Badge variant="red">UC-3D — Ops Manager View</Badge>
                        </div>
                        <div className="overflow-x-auto mb-6">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-surface-border text-left text-xs text-brand-gray">
                                        <th className="p-3 font-medium">Interval</th>
                                        <th className="p-3 font-medium text-right">FTE Loss %</th>
                                        <th className="p-3 font-medium text-right">Agents on AUX</th>
                                        <th className="p-3 font-medium">Note</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {TEAM_B_INTERVALS.map((row) => (
                                        <tr key={row.time} className={`border-b border-surface-border last:border-0 ${row.fteLoss >= 55 ? 'bg-status-red/5' : row.fteLoss >= 45 ? 'bg-status-amber/5' : ''}`}>
                                            <td className="p-3 font-mono text-xs">{row.time}</td>
                                            <td className="p-3 text-right">
                                                <span className={`font-bold ${row.fteLoss >= 55 ? 'text-status-red' : row.fteLoss >= 45 ? 'text-status-amber' : ''}`}>
                                                    {row.fteLoss}%
                                                </span>
                                            </td>
                                            <td className="p-3 text-right">{row.onAux}</td>
                                            <td className="p-3 text-xs text-brand-gray">
                                                {row.comment}
                                                {row.fteLoss >= 55 && !row.comment && <span className="text-status-red">Critical</span>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <ServiceLevelChart data={TEAM_B_SL_INTERVALS} target={80} />
                        <div className="mt-3 rounded-lg border border-status-green/30 bg-status-green/5 p-3 text-xs">
                            <strong>System recommendation:</strong> Shift breaks from 10:30 to 11:15. Projected SL recovery: 71% → 82%. Move 3 agents from personal AUX to available state.
                        </div>
                    </Card>
                )}

                <FteLossComparative teams={data.fteTeams} />
            </div>
        </DashboardTemplate>
    )
}
