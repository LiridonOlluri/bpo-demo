'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { DashboardTemplate } from '@/components/templates/DashboardTemplate'
import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import { StatCard } from '@/components/molecules/StatCard'
import { AlertBanner } from '@/components/molecules/AlertBanner'
import { CheckCircle2, Clock, AlertTriangle, Send } from 'lucide-react'

interface ContractRow {
    agent: string
    id: string
    type: string
    start: string
    end: string
    probationEnd: string
    status: 'active' | 'expiring' | 'probation' | 'expired'
    daysUntilExpiry?: number
    qaScore?: number
    attendance?: number
    renewalCount?: number
    annexSent?: boolean
}

const CONTRACTS: ContractRow[] = [
    { agent: 'Agent #14 — Clara Reyes', id: 'c-001', type: 'Fixed-Term (6-month)', start: '2025-09-01', end: '2026-04-01', probationEnd: '2025-12-01', status: 'expiring', daysUntilExpiry: 6, qaScore: 82, attendance: 94, renewalCount: 1 },
    { agent: 'Agent #22 — David Kim', id: 'c-002', type: 'Fixed-Term (6-month)', start: '2025-10-01', end: '2026-04-15', probationEnd: '2026-01-01', status: 'expiring', daysUntilExpiry: 20, qaScore: 71, attendance: 87, renewalCount: 0 },
    { agent: 'Agent #31 — Elena Rossi', id: 'c-003', type: 'Fixed-Term (6-month)', start: '2025-10-15', end: '2026-04-15', probationEnd: '2026-01-15', status: 'expiring', daysUntilExpiry: 20, qaScore: 91, attendance: 98, renewalCount: 1 },
    { agent: 'Alice Monroe', id: 'c-004', type: 'Permanent', start: '2024-06-01', end: '—', probationEnd: '2024-12-01', status: 'active', renewalCount: 0 },
    { agent: 'Ben Carter', id: 'c-005', type: 'Permanent', start: '2025-01-15', end: '—', probationEnd: '2025-07-15', status: 'active', renewalCount: 0 },
    { agent: 'Farid Hassan', id: 'c-006', type: 'Fixed-Term (6-month)', start: '2026-01-15', end: '2026-07-15', probationEnd: '2026-07-15', status: 'probation', daysUntilExpiry: 111, qaScore: 78, attendance: 91, renewalCount: 0 },
    { agent: 'Grace Tan', id: 'c-007', type: 'Permanent', start: '2024-09-01', end: '—', probationEnd: '2025-03-01', status: 'active', renewalCount: 0 },
    { agent: 'Hugo Mendez', id: 'c-008', type: 'Fixed-Term (6-month)', start: '2025-06-01', end: '2026-06-01', probationEnd: '2025-12-01', status: 'active', daysUntilExpiry: 67, qaScore: 85, attendance: 96, renewalCount: 1 },
]

const RENEW_RECOMMENDATIONS: Record<string, { action: string; variant: 'green' | 'amber' | 'red'; note: string }> = {
    'c-001': { action: 'Renew', variant: 'green', note: 'QA 82%, attendance 94% — performing above threshold.' },
    'c-002': { action: 'Review', variant: 'amber', note: 'QA 71% — below 75% threshold. Requires performance discussion before renewal.' },
    'c-003': { action: 'Renew + Salary Increase', variant: 'green', note: 'QA 91%, attendance 98% — top performer. Salary increase recommended.' },
}

const STATUS_CONFIG: Record<string, { badge: 'green' | 'amber' | 'blue' | 'grey' | 'red'; label: string }> = {
    active: { badge: 'green', label: 'Active' },
    expiring: { badge: 'amber', label: 'Expiring' },
    probation: { badge: 'blue', label: 'Probation' },
    expired: { badge: 'grey', label: 'Expired' },
}

function daysLabel(days: number) {
    if (days <= 30) return `${days} days — 30-day alert`
    if (days <= 45) return `${days} days — 45-day alert`
    if (days <= 60) return `${days} days — 60-day alert`
    return `${days} days`
}

function daysVariant(days: number): 'red' | 'amber' | 'blue' {
    if (days <= 30) return 'red'
    if (days <= 45) return 'amber'
    return 'blue'
}

export default function ContractsPage() {
    const [annexSent, setAnnexSent] = useState<Set<string>>(new Set())
    const [dismissed, setDismissed] = useState<Set<string>>(new Set())

    const expiring = CONTRACTS.filter((c) => c.status === 'expiring' && !dismissed.has(c.id))
    const active = CONTRACTS.filter((c) => c.status === 'active' || c.status === 'probation')

    const expiring30 = expiring.filter((c) => (c.daysUntilExpiry ?? 999) <= 30).length
    const expiring60 = expiring.filter((c) => (c.daysUntilExpiry ?? 999) <= 60).length

    const handleSendAnnex = (id: string, name: string) => {
        setAnnexSent((prev) => new Set([...prev, id]))
        toast.success('Annex sent for e-signature', { description: `${name} — pre-filled annex sent. Awaiting signature.` })
    }

    return (
        <DashboardTemplate
            title="Contract Lifecycle Tracker — UC-4E"
            statCards={
                <>
                    <StatCard label="Active Contracts" value={active.length} variant="green" />
                    <StatCard label="Expiring ≤ 60 days" value={expiring60} variant={expiring60 > 0 ? 'amber' : 'default'} trendValue="Auto-ticket fired" />
                    <StatCard label="Expiring ≤ 30 days" value={expiring30} variant={expiring30 > 0 ? 'red' : 'default'} trendValue="Urgent action required" />
                    <StatCard label="Annexes sent" value={annexSent.size} variant="green" />
                </>
            }
        >
            <div className="space-y-6">
                {expiring.length > 0 && (
                    <AlertBanner
                        variant="amber"
                        message={`${expiring.length} contracts expiring within 60 days. Renewal tickets auto-created with performance summaries. One-click annex generation available.`}
                    />
                )}

                {/* UC-4E — Contract Annex Review */}
                {expiring.length > 0 && (
                    <Card>
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-gray">
                                Contract Annex Review — Expiring Contracts (UC-4E)
                            </h2>
                            <Badge variant="amber">{expiring.length} pending</Badge>
                        </div>
                        <div className="space-y-3">
                            {expiring.map((c) => {
                                const rec = RENEW_RECOMMENDATIONS[c.id]
                                const sent = annexSent.has(c.id)
                                return (
                                    <div key={c.id} className="rounded-lg border border-surface-border p-4">
                                        <div className="flex flex-wrap items-start justify-between gap-3">
                                            <div className="space-y-1">
                                                <p className="font-medium text-sm">{c.agent}</p>
                                                <div className="flex flex-wrap gap-2 text-xs text-brand-gray">
                                                    <span>{c.type}</span>
                                                    <span>·</span>
                                                    <span>Expires: {c.end}</span>
                                                    <span>·</span>
                                                    <span>Renewal #{(c.renewalCount ?? 0) + 1}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                {c.daysUntilExpiry !== undefined && (
                                                    <Badge variant={daysVariant(c.daysUntilExpiry)}>
                                                        {daysLabel(c.daysUntilExpiry)}
                                                    </Badge>
                                                )}
                                                {rec && <Badge variant={rec.variant}>{rec.action}</Badge>}
                                            </div>
                                        </div>

                                        {rec && (
                                            <div className={`mt-3 rounded-lg px-3 py-2 text-xs ${rec.variant === 'green' ? 'bg-status-green/5 text-status-green' : 'bg-status-amber/5 text-status-amber'}`}>
                                                <div className="flex items-start gap-1.5">
                                                    {rec.variant === 'green' ? <CheckCircle2 size={12} className="mt-0.5 shrink-0" /> : <AlertTriangle size={12} className="mt-0.5 shrink-0" />}
                                                    {rec.note}
                                                </div>
                                            </div>
                                        )}

                                        <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                                            <div className="rounded bg-surface-muted p-2 text-center">
                                                <p className="text-brand-gray">QA Score</p>
                                                <p className={`font-bold ${(c.qaScore ?? 0) >= 80 ? 'text-status-green' : 'text-status-amber'}`}>{c.qaScore}%</p>
                                            </div>
                                            <div className="rounded bg-surface-muted p-2 text-center">
                                                <p className="text-brand-gray">Attendance</p>
                                                <p className={`font-bold ${(c.attendance ?? 0) >= 90 ? 'text-status-green' : 'text-status-amber'}`}>{c.attendance}%</p>
                                            </div>
                                            <div className="rounded bg-surface-muted p-2 text-center">
                                                <p className="text-brand-gray">Contract #</p>
                                                <p className="font-bold">{(c.renewalCount ?? 0) + 1}</p>
                                            </div>
                                        </div>

                                        <div className="mt-3 flex gap-2">
                                            {!sent ? (
                                                <>
                                                    <Button size="sm" onClick={() => handleSendAnnex(c.id, c.agent)}>
                                                        <Send size={12} />
                                                        Send annex for e-sign
                                                    </Button>
                                                    <Button size="sm" variant="ghost" onClick={() => { setDismissed((prev) => new Set([...prev, c.id])); toast.info('Deferred', { description: `Contract for ${c.agent} deferred — reminder in 7 days.` }) }}>
                                                        Defer 7 days
                                                    </Button>
                                                </>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-xs text-status-green">
                                                    <CheckCircle2 size={14} />
                                                    Annex sent — awaiting e-signature
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </Card>
                )}

                {/* Full contract table */}
                <Card padding={false}>
                    <div className="border-b border-surface-border p-4">
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-gray">All Contracts</h2>
                        <p className="text-xs text-brand-gray mt-1">60/45/30 day auto-alerts. Probation review ticket fires at day 75.</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-surface-border text-left text-xs text-brand-gray">
                                    <th className="p-4 font-medium">Agent</th>
                                    <th className="p-4 font-medium">Type</th>
                                    <th className="p-4 font-medium">Start</th>
                                    <th className="p-4 font-medium">End</th>
                                    <th className="p-4 font-medium">Probation End</th>
                                    <th className="p-4 font-medium">Status</th>
                                    <th className="p-4 font-medium">Days Left</th>
                                </tr>
                            </thead>
                            <tbody>
                                {CONTRACTS.map((c) => (
                                    <tr key={c.id} className="border-b border-surface-border last:border-0 hover:bg-surface-muted/50">
                                        <td className="p-4 font-medium">{c.agent}</td>
                                        <td className="p-4">{c.type}</td>
                                        <td className="p-4 text-brand-gray">{c.start}</td>
                                        <td className="p-4 text-brand-gray">{c.end}</td>
                                        <td className="p-4 text-brand-gray">{c.probationEnd}</td>
                                        <td className="p-4">
                                            <Badge variant={STATUS_CONFIG[c.status].badge}>{STATUS_CONFIG[c.status].label}</Badge>
                                        </td>
                                        <td className="p-4">
                                            {c.daysUntilExpiry !== undefined && (
                                                <Badge variant={daysVariant(c.daysUntilExpiry)}>{c.daysUntilExpiry}d</Badge>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </DashboardTemplate>
    )
}
