'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { DashboardTemplate } from '@/components/templates/DashboardTemplate'
import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import { StatCard } from '@/components/molecules/StatCard'
import { AlertBanner } from '@/components/molecules/AlertBanner'
import { CheckCircle2, ArrowRight, User, Shield, FileText, Network } from 'lucide-react'

const PROMOTABLE_AGENTS = [
    { id: 'a15', name: 'Agent #15 — Oscar Tran', from: 'Agent Associate', fromLevel: 1, to: 'Team Lead', toLevel: 2, team: 'Team E', client: 'Client B', qaScore: 91, tenure: '14 months', reason: 'Top performer — QA 91%, adherence 94%, 0 missing minutes.' },
    { id: 'a09', name: 'Agent #9 — Isla Novak', from: 'Agent Associate', fromLevel: 1, to: 'Senior Agent / SME', toLevel: 2, team: 'Team C', client: 'Client A', qaScore: 88, tenure: '11 months', reason: 'Tier-2 certified, consistent top-3 QA, knowledge base contributor.' },
]

type PromotionStage = 'select' | 'review' | 'generated'

const AUTO_GENERATED = [
    { icon: FileText, label: 'Annex generated', detail: 'New title, salary band TL-2, effective April 16' },
    { icon: Network, label: 'Org chart updated', detail: 'Agent #15 now shows as TL — Team E (10 agents)' },
    { icon: Shield, label: 'Permissions elevated', detail: 'L1 → L2: team dashboard, coaching Kanban, leave approvals, attendance panel unlocked' },
    { icon: User, label: 'Role change ticket', detail: 'HR ticket created — salary band confirmation required within 5 days' },
    { icon: CheckCircle2, label: 'Training plan created', detail: 'Team Lead onboarding: 1-week management training module (configurable)' },
    { icon: CheckCircle2, label: 'Team capacity adjusted', detail: 'Team E: Agent #15 removed from production pool. Replacement scheduling triggered.' },
]

export default function PromotionPage() {
    const [stage, setStage] = useState<PromotionStage>('select')
    const [selected, setSelected] = useState<typeof PROMOTABLE_AGENTS[0] | null>(null)
    const [salaryBand, setSalaryBand] = useState('')

    const handlePromote = () => {
        if (!salaryBand.trim()) {
            toast.error('Enter new salary band before confirming.')
            return
        }
        setStage('generated')
        toast.success(`${selected?.name} promoted to ${selected?.to}`, { description: 'Annex, org chart, permissions, and training plan auto-generated.' })
    }

    return (
        <DashboardTemplate
            title="Promotion Trigger — UC-4C"
            statCards={
                <>
                    <StatCard label="Eligible for Promotion" value={PROMOTABLE_AGENTS.length} variant="green" />
                    <StatCard label="Auto-Generated Steps" value={AUTO_GENERATED.length} />
                    <StatCard label="Process" value="1-click" variant="green" />
                </>
            }
        >
            <div className="space-y-6">
                {stage === 'select' && (
                    <Card className="space-y-4">
                        <h2 className="text-lg font-semibold">Select Agent to Promote</h2>
                        <div className="space-y-3">
                            {PROMOTABLE_AGENTS.map((agent) => (
                                <div
                                    key={agent.id}
                                    onClick={() => setSelected(agent)}
                                    className={`cursor-pointer rounded-lg border p-4 transition-colors ${selected?.id === agent.id ? 'border-brand-primary bg-brand-primary/5' : 'border-surface-border hover:bg-surface-muted/50'}`}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <p className="font-medium">{agent.name}</p>
                                            <p className="text-xs text-brand-gray">{agent.team} · {agent.client}</p>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Badge variant="grey">{agent.from}</Badge>
                                            <ArrowRight size={14} className="text-brand-gray" />
                                            <Badge variant="green">{agent.to}</Badge>
                                        </div>
                                    </div>
                                    <p className="mt-2 text-xs text-brand-gray">{agent.reason}</p>
                                    <div className="mt-2 flex gap-3 text-xs">
                                        <span className="text-brand-gray">QA: <span className="font-semibold text-status-green">{agent.qaScore}%</span></span>
                                        <span className="text-brand-gray">Tenure: <span className="font-semibold">{agent.tenure}</span></span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button disabled={!selected} onClick={() => setStage('review')}>
                            Review Promotion Package
                        </Button>
                    </Card>
                )}

                {stage === 'review' && selected && (
                    <Card className="space-y-4">
                        <h2 className="text-lg font-semibold">Promotion Review — {selected.name}</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-lg bg-surface-muted p-3 text-sm space-y-1">
                                <p className="text-xs text-brand-gray">Current role</p>
                                <p className="font-medium">{selected.from} (Level {selected.fromLevel})</p>
                            </div>
                            <div className="rounded-lg bg-brand-primary/5 border border-brand-primary/20 p-3 text-sm space-y-1">
                                <p className="text-xs text-brand-gray">New role</p>
                                <p className="font-semibold">{selected.to} (Level {selected.toLevel})</p>
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-medium text-brand-gray">New Salary Band (EUR/month)</label>
                            <input
                                type="text"
                                placeholder="e.g. 1,200 – 1,400"
                                value={salaryBand}
                                onChange={(e) => setSalaryBand(e.target.value)}
                                className="w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                            />
                        </div>

                        <div className="rounded-lg border border-surface-border p-3 space-y-2">
                            <p className="text-sm font-semibold">What will be auto-generated:</p>
                            {AUTO_GENERATED.map((item) => (
                                <div key={item.label} className="flex items-start gap-2 text-xs">
                                    <item.icon size={14} className="mt-0.5 shrink-0 text-brand-primary" />
                                    <div>
                                        <span className="font-medium">{item.label}</span>
                                        <span className="ml-1 text-brand-gray">— {item.detail}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-3">
                            <Button onClick={handlePromote}>
                                Confirm Promotion
                            </Button>
                            <Button variant="ghost" onClick={() => setStage('select')}>Back</Button>
                        </div>
                    </Card>
                )}

                {stage === 'generated' && selected && (
                    <Card className="space-y-4">
                        <AlertBanner variant="amber" message={`${selected.name} promoted to ${selected.to} (Level ${selected.toLevel}). All items auto-generated.`} />
                        <h2 className="text-lg font-semibold">Generated Actions</h2>
                        <div className="space-y-2">
                            {AUTO_GENERATED.map((item) => (
                                <div key={item.label} className="flex items-start gap-2 rounded-lg bg-status-green/5 border border-status-green/20 p-3 text-sm">
                                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-status-green" />
                                    <div>
                                        <p className="font-medium">{item.label}</p>
                                        <p className="text-xs text-brand-gray">{item.detail}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="rounded-lg border border-surface-border p-3 text-sm">
                            <p className="font-semibold">Salary Band</p>
                            <p className="text-brand-gray">€{salaryBand}/month — annex sent for e-signature to {selected.name}</p>
                        </div>
                        <Button variant="ghost" onClick={() => { setStage('select'); setSelected(null); setSalaryBand('') }}>
                            Start another promotion
                        </Button>
                    </Card>
                )}
            </div>
        </DashboardTemplate>
    )
}
