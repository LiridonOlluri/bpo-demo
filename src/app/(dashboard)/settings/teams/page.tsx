'use client'

import { DashboardTemplate } from '@/components/templates/DashboardTemplate'
import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import { TEAMS } from '@/lib/constants'
import { StatCard } from '@/components/molecules/StatCard'

function clientLabel(clientId: string) {
    return clientId === 'client-a' ? 'Client A (Voice)' : 'Client B (Chat + Voice)'
}

export default function TeamsPage() {
    return (
        <DashboardTemplate
            title="Team Assignment"
            statCards={
                <>
                    <StatCard label="Teams" value={10} variant="default" />
                    <StatCard label="Agents" value={100} variant="green" />
                    <StatCard label="Client A teams" value={6} />
                    <StatCard label="Client B teams" value={4} />
                </>
            }
        >
            <p className="mb-4 text-sm text-brand-gray">
                Demo aligns with meTru ERP BPO v1.0: six teams on Client A, four teams on Client B (60 + 40 agents).
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {TEAMS.map((team) => (
                    <Card key={team.id} className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">{team.name}</h3>
                            <Badge variant="green">ACTIVE</Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-brand-gray">Team Lead</span>
                                <span className="font-medium">{team.leadName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-brand-gray">Agents</span>
                                <span className="font-medium">10</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-brand-gray">Programme</span>
                                <span className="font-medium">{clientLabel(team.clientId)}</span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </DashboardTemplate>
    )
}
