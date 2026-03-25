'use client'

import { DashboardTemplate } from '@/components/templates/DashboardTemplate'
import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'

interface OnboardingAgent {
    id: string
    name: string
    stage: string
    startDate: string
    client: string
}

const stages = ['Offer', 'Documentation', 'Training', 'Nesting', 'Production']

const mockAgents: OnboardingAgent[] = [
    { id: 'new-001', name: 'Miguel Torres', stage: 'Documentation', startDate: '2026-04-01', client: 'Acme Corp' },
    { id: 'new-002', name: 'Sophie Laurent', stage: 'Training', startDate: '2026-03-18', client: 'Acme Corp' },
    { id: 'new-003', name: 'Raj Kapoor', stage: 'Nesting', startDate: '2026-03-10', client: 'Globex Ltd' },
    { id: 'new-004', name: 'Emily Chen', stage: 'Offer', startDate: '2026-04-07', client: 'Globex Ltd' },
]

const stageVariant: Record<string, 'blue' | 'amber' | 'green' | 'grey'> = {
    Offer: 'grey',
    Documentation: 'blue',
    Training: 'amber',
    Nesting: 'amber',
    Production: 'green',
}

export default function OnboardingPage() {
    return (
        <DashboardTemplate title="Onboarding Pipeline">
            <div className="grid gap-4 md:grid-cols-5">
                {stages.map((stage) => {
                    const agents = mockAgents.filter((a) => a.stage === stage)
                    return (
                        <div key={stage} className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold">{stage}</h3>
                                <Badge variant={stageVariant[stage]}>{agents.length}</Badge>
                            </div>
                            <div className="space-y-2">
                                {agents.map((agent) => (
                                    <Card key={agent.id} className="space-y-1">
                                        <p className="text-sm font-medium">{agent.name}</p>
                                        <p className="text-xs text-brand-gray">{agent.client}</p>
                                        <p className="text-xs text-brand-gray">Start: {agent.startDate}</p>
                                    </Card>
                                ))}
                                {agents.length === 0 && (
                                    <div className="rounded-lg border border-dashed border-surface-border p-4 text-center text-xs text-brand-gray">
                                        No agents
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </DashboardTemplate>
    )
}
