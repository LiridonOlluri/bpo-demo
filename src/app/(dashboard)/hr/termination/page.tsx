'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { DashboardTemplate } from '@/components/templates/DashboardTemplate'
import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import { StatCard } from '@/components/molecules/StatCard'
import { AlertBanner } from '@/components/molecules/AlertBanner'
import { CheckCircle2, XCircle, AlertTriangle, Clock } from 'lucide-react'

type TermStep = 'request' | 'hr-review' | 'checklist'
type TermReason = 'performance' | 'voluntary' | 'attendance' | 'misconduct' | 'end-of-contract' | 'mutual'

const AGENT = {
    id: 'a06',
    name: 'Agent #44 — Frank Osei',
    team: 'Team B',
    lead: 'Marcus Jones',
    client: 'Client A',
    contract: '6-month fixed-term',
    startDate: '2025-10-01',
    endDate: '2026-04-01',
    noticePeriod: 15,
    unusedLeave: 8,
    missingMinutes: 12,
}

const PERFORMANCE_EVIDENCE = {
    qaScore: 64,
    qaThreshold: 75,
    adherence: 74,
    adherenceThreshold: 85,
    coachingTickets: 5,
    unresolvedTickets: 3,
    writtenWarnings: 2,
    bradfordScore: 186,
}

const PIP_STEPS = [
    { label: 'Verbal warning', date: 'March 1', done: true },
    { label: 'Written warning #1', date: 'March 15', done: true },
    { label: 'Written warning #2', date: 'April 2', done: true },
    { label: 'PIP completed', date: 'April 15', done: true, note: 'No improvement observed' },
    { label: 'Notice period (15 days)', date: 'April 16–30', done: false },
]

type ChecklistStatus = 'pending' | 'complete' | 'scheduled'
interface ChecklistItem {
    step: string
    responsible: string
    deadline: string
    status: ChecklistStatus
}

const INITIAL_CHECKLIST: ChecklistItem[] = [
    { step: 'Confirm last working day (April 30)', responsible: 'HR', deadline: 'Immediate', status: 'complete' },
    { step: 'Schedule during notice period (normal shifts)', responsible: 'WFM', deadline: 'Immediate', status: 'complete' },
    { step: 'Equipment return (laptop, headset, badge)', responsible: 'IT/Facilities', deadline: 'April 30', status: 'pending' },
    { step: 'System access revocation (dialer, CRM, VPN, email)', responsible: 'IT', deadline: 'May 1', status: 'scheduled' },
    { step: 'Final payslip: salary to April 30 + 8 days leave payout − missing minutes', responsible: 'Payroll', deadline: 'May 5', status: 'pending' },
    { step: 'Exit interview', responsible: 'HR', deadline: 'April 25–30', status: 'scheduled' },
    { step: 'Knowledge transfer (agent handles escalations)', responsible: 'TL-B', deadline: 'April 16–30', status: 'pending' },
    { step: 'Capacity update: Team B drops to 9 agents', responsible: 'WFM', deadline: 'Immediate', status: 'complete' },
    { step: 'Hiring trigger: Team B below minimum — 1 replacement created', responsible: 'HR/Recruiting', deadline: 'Immediate', status: 'complete' },
    { step: 'Client A notification (per contract clause)', responsible: 'AM', deadline: 'April 16', status: 'pending' },
    { step: 'Archive employee record (data retention policy)', responsible: 'HR', deadline: 'May 30', status: 'scheduled' },
]

const STATUS_CONFIG: Record<ChecklistStatus, { badge: 'green' | 'amber' | 'blue'; icon: React.ReactNode }> = {
    complete: { badge: 'green', icon: <CheckCircle2 size={14} className="text-status-green" /> },
    pending: { badge: 'amber', icon: <Clock size={14} className="text-status-amber" /> },
    scheduled: { badge: 'blue', icon: <Clock size={14} className="text-blue-500" /> },
}

const REASON_LABELS: Record<TermReason, string> = {
    performance: 'Performance-based',
    voluntary: 'Voluntary resignation',
    attendance: 'Attendance/conduct',
    misconduct: 'Misconduct',
    'end-of-contract': 'End of contract',
    mutual: 'Mutual agreement',
}

export default function TerminationPage() {
    const [step, setStep] = useState<TermStep>('request')
    const [reason, setReason] = useState<TermReason>('performance')
    const [checklist, setChecklist] = useState<ChecklistItem[]>(INITIAL_CHECKLIST)
    const [hrDecision, setHrDecision] = useState<'pending' | 'approved' | 'rejected'>('pending')

    const toggleItem = (index: number) => {
        setChecklist((prev) =>
            prev.map((item, i) =>
                i === index ? { ...item, status: item.status === 'complete' ? 'pending' : 'complete' } : item
            )
        )
    }

    const completeItems = checklist.filter((c) => c.status === 'complete').length

    return (
        <DashboardTemplate
            title="Termination Workflow — UC-4F"
            statCards={
                <>
                    <StatCard label="Agent" value={AGENT.name} />
                    <StatCard label="Notice Period" value={`${AGENT.noticePeriod} days`} />
                    <StatCard label="Unused Leave Payout" value={`${AGENT.unusedLeave} days`} variant="amber" />
                    <StatCard label="Checklist Progress" value={`${completeItems}/${checklist.length}`} variant={completeItems === checklist.length ? 'green' : 'amber'} />
                </>
            }
        >
            <div className="space-y-6">
                {/* Step tabs */}
                <div className="flex gap-2">
                    {(['request', 'hr-review', 'checklist'] as TermStep[]).map((s, i) => (
                        <button
                            key={s}
                            onClick={() => setStep(s)}
                            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${step === s ? 'bg-zinc-900 text-white' : 'bg-surface-muted text-brand-gray hover:bg-zinc-100'}`}
                        >
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs">{i + 1}</span>
                            {s === 'request' ? 'TL Request' : s === 'hr-review' ? 'HR Review' : 'Offboarding'}
                        </button>
                    ))}
                </div>

                {step === 'request' && (
                    <Card className="space-y-4">
                        <h2 className="text-lg font-semibold">Step 1 — TL Initiates Termination Request</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-lg bg-surface-muted p-3 text-sm">
                                <p className="text-xs text-brand-gray">Agent</p>
                                <p className="font-medium">{AGENT.name}</p>
                                <p className="text-xs text-brand-gray">{AGENT.team} · TL: {AGENT.lead}</p>
                            </div>
                            <div>
                                <p className="mb-2 text-xs font-medium text-brand-gray">Termination Reason</p>
                                <div className="flex flex-wrap gap-2">
                                    {(Object.entries(REASON_LABELS) as [TermReason, string][]).map(([key, label]) => (
                                        <button
                                            key={key}
                                            onClick={() => setReason(key)}
                                            className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-colors ${reason === key ? 'bg-zinc-900 text-white border-zinc-900' : 'border-surface-border text-brand-gray hover:bg-surface-muted'}`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {reason === 'performance' && (
                            <div className="space-y-3">
                                <p className="text-sm font-semibold">Auto-attached performance evidence:</p>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div className="rounded-lg border border-status-red/30 bg-status-red/5 p-3 text-sm">
                                        <p className="font-medium text-status-red">QA Score: {PERFORMANCE_EVIDENCE.qaScore}%</p>
                                        <p className="text-xs text-brand-gray">Below {PERFORMANCE_EVIDENCE.qaThreshold}% threshold for 3 months</p>
                                    </div>
                                    <div className="rounded-lg border border-status-amber/30 bg-status-amber/5 p-3 text-sm">
                                        <p className="font-medium text-status-amber">Adherence: {PERFORMANCE_EVIDENCE.adherence}%</p>
                                        <p className="text-xs text-brand-gray">vs {PERFORMANCE_EVIDENCE.adherenceThreshold}% target</p>
                                    </div>
                                    <div className="rounded-lg border border-surface-border p-3 text-sm">
                                        <p className="font-medium">{PERFORMANCE_EVIDENCE.coachingTickets} coaching tickets</p>
                                        <p className="text-xs text-brand-gray">{PERFORMANCE_EVIDENCE.unresolvedTickets} unresolved</p>
                                    </div>
                                    <div className="rounded-lg border border-status-red/30 bg-status-red/5 p-3 text-sm">
                                        <p className="font-medium text-status-red">Bradford Score: {PERFORMANCE_EVIDENCE.bradfordScore}</p>
                                        <p className="text-xs text-brand-gray">Mon/Fri pattern · return-to-work pending</p>
                                    </div>
                                </div>

                                <div className="rounded-lg border border-surface-border p-3">
                                    <p className="mb-2 text-sm font-semibold">PIP compliance verification</p>
                                    <ul className="space-y-1.5">
                                        {PIP_STEPS.map((s) => (
                                            <li key={s.label} className={`flex items-center gap-2 text-xs ${s.done ? 'text-status-green' : 'text-brand-gray'}`}>
                                                {s.done ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                                                <span className="font-medium">{s.label}</span>
                                                <span className="text-brand-gray">{s.date}</span>
                                                {s.note && <span className="text-status-red">— {s.note}</span>}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        <Button onClick={() => setStep('hr-review')}>
                            Submit to HR for Review
                        </Button>
                    </Card>
                )}

                {step === 'hr-review' && (
                    <Card className="space-y-4">
                        <h2 className="text-lg font-semibold">Step 2 — HR Review & Decision</h2>
                        <AlertBanner variant="amber" message="HR Manager receives ticket. Compliance check: all PIP steps verified ✓. Notice period: 15 days per contract ✓. Unused leave: 8 days (must be paid out or used during notice)." />

                        <div className="rounded-lg border border-surface-border p-4 text-sm space-y-2">
                            <p className="font-semibold">Compliance summary</p>
                            {[
                                { label: 'Verbal warning', detail: 'Given March 1', ok: true },
                                { label: 'Written warning #1', detail: 'Given March 15', ok: true },
                                { label: 'Written warning #2', detail: 'Given April 2', ok: true },
                                { label: 'PIP completed', detail: 'April 15 — no improvement', ok: true },
                                { label: 'Notice period', detail: '15 days per contract', ok: true },
                                { label: 'Unused leave (8 days)', detail: 'Must be paid out — included in final payslip', ok: true },
                            ].map((row) => (
                                <div key={row.label} className="flex items-center gap-2">
                                    <CheckCircle2 size={14} className="text-status-green shrink-0" />
                                    <span className="font-medium">{row.label}:</span>
                                    <span className="text-brand-gray">{row.detail}</span>
                                </div>
                            ))}
                        </div>

                        {hrDecision === 'pending' && (
                            <div className="flex gap-3">
                                <Button onClick={() => { setHrDecision('approved'); toast.success('Termination approved', { description: 'Effective April 30. Offboarding checklist generated.' }); setTimeout(() => setStep('checklist'), 1000) }}>
                                    <CheckCircle2 size={16} />
                                    Approve — Effective April 30
                                </Button>
                                <Button variant="ghost" onClick={() => { setHrDecision('rejected'); toast.error('Termination rejected', { description: 'HR has rejected the request. TL notified.' }) }}>
                                    <XCircle size={16} />
                                    Reject
                                </Button>
                            </div>
                        )}
                        {hrDecision === 'approved' && (
                            <AlertBanner variant="amber" message="Termination approved. Effective date: April 30. Offboarding checklist auto-generated. →" />
                        )}
                        {hrDecision === 'rejected' && (
                            <AlertBanner variant="red" message="Termination rejected by HR. TL has been notified. Reason must be provided separately." />
                        )}

                        {/* Capacity impact — shows immediately on approval */}
                        <div className="rounded-lg border border-status-red/30 bg-status-red/5 p-3 text-sm">
                            <p className="font-semibold text-status-red">Capacity Impact (immediate)</p>
                            <p className="text-xs mt-1">Team B drops from 10 to 9 agents. Erlang recalculation: SL projected at 74% (target 80%) during 10:00–14:00 peak.</p>
                            <p className="text-xs text-brand-gray mt-1">Hiring ticket auto-created: 1 replacement for Client A, voice, start date needed by May 15.</p>
                        </div>
                    </Card>
                )}

                {step === 'checklist' && (
                    <Card className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Step 3 — Offboarding Checklist</h2>
                            <Badge variant={completeItems === checklist.length ? 'green' : 'amber'}>
                                {completeItems}/{checklist.length} complete
                            </Badge>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-surface-border text-left text-xs text-brand-gray">
                                        <th className="p-3 font-medium">Step</th>
                                        <th className="p-3 font-medium">Responsible</th>
                                        <th className="p-3 font-medium">Deadline</th>
                                        <th className="p-3 font-medium">Status</th>
                                        <th className="p-3 font-medium">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {checklist.map((item, i) => (
                                        <tr key={item.step} className="border-b border-surface-border last:border-0 hover:bg-surface-muted/50">
                                            <td className="p-3 text-xs">{item.step}</td>
                                            <td className="p-3 text-xs text-brand-gray">{item.responsible}</td>
                                            <td className="p-3 text-xs text-brand-gray">{item.deadline}</td>
                                            <td className="p-3">
                                                <div className="flex items-center gap-1">
                                                    {STATUS_CONFIG[item.status].icon}
                                                    <Badge variant={STATUS_CONFIG[item.status].badge}>
                                                        {item.status}
                                                    </Badge>
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                {item.status !== 'complete' && (
                                                    <Button size="sm" variant="ghost" onClick={() => { toggleItem(i); toast.success('Step completed') }}>
                                                        Mark done
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                )}
            </div>
        </DashboardTemplate>
    )
}
