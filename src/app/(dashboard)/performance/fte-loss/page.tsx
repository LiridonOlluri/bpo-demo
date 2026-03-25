'use client'

import { useState } from 'react'
import { DashboardTemplate } from '@/components/templates/DashboardTemplate'
import { StatCard } from '@/components/molecules/StatCard'
import { TabGroup } from '@/components/molecules/TabGroup'
import { FteLossWidget } from '@/components/organisms/FteLossWidget'
import { FteLossComparative } from '@/components/organisms/FteLossComparative'
import { Spinner } from '@/components/atoms/Spinner'
import { usePerformanceDemo } from '@/lib/api/queries/usePerformanceDemo'

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
                <FteLossComparative teams={data.fteTeams} />
            </div>
        </DashboardTemplate>
    )
}
