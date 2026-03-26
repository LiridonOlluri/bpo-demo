'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { DashboardTemplate } from '@/components/templates/DashboardTemplate'
import { LeaveCapacityCalendar } from '@/components/organisms/LeaveCapacityCalendar'
import { SmartLeavePush } from '@/components/organisms/SmartLeavePush'
import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { StatCard } from '@/components/molecules/StatCard'
import { AlertBanner } from '@/components/molecules/AlertBanner'
import type { LeaveCapacityWeek, LeaveRequest } from '@/types/leave'
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'

const mockWeeks: LeaveCapacityWeek[] = [
    { weekNumber: 13, startDate: '2026-03-23', slotsAvailable: 4, slotsUsed: 3, slotsRemaining: 1, status: 'amber', volumeForecastDelta: 2, smartPushActive: false },
    { weekNumber: 14, startDate: '2026-03-30', slotsAvailable: 4, slotsUsed: 4, slotsRemaining: 0, status: 'red', volumeForecastDelta: 5, smartPushActive: false },
    { weekNumber: 15, startDate: '2026-04-06', slotsAvailable: 5, slotsUsed: 1, slotsRemaining: 4, status: 'green', volumeForecastDelta: -12, smartPushActive: true },
    { weekNumber: 16, startDate: '2026-04-13', slotsAvailable: 5, slotsUsed: 2, slotsRemaining: 3, status: 'green', volumeForecastDelta: -3, smartPushActive: false },
    { weekNumber: 17, startDate: '2026-04-20', slotsAvailable: 4, slotsUsed: 2, slotsRemaining: 2, status: 'green', volumeForecastDelta: 0, smartPushActive: false },
    { weekNumber: 18, startDate: '2026-04-27', slotsAvailable: 4, slotsUsed: 3, slotsRemaining: 1, status: 'amber', volumeForecastDelta: 8, smartPushActive: false },
    { weekNumber: 19, startDate: '2026-05-04', slotsAvailable: 5, slotsUsed: 1, slotsRemaining: 4, status: 'green', volumeForecastDelta: -5, smartPushActive: false },
    { weekNumber: 20, startDate: '2026-05-11', slotsAvailable: 5, slotsUsed: 0, slotsRemaining: 5, status: 'green', volumeForecastDelta: -8, smartPushActive: false },
]
const smartPushWeek = mockWeeks.find((w) => w.smartPushActive)!
const suggestedAgents = [
    { name: 'Karen Müller', leaveBalance: 14 },
    { name: 'Oscar Tran', leaveBalance: 11 },
    { name: 'Ella Brooks', leaveBalance: 9 },
]

const INITIAL_REQUESTS: LeaveRequest[] = [
    { id: 'lr-001', agentId: 'Alice Monroe', type: 'paid', startDate: '2026-03-30', endDate: '2026-04-03', daysRequested: 5, status: 'approved', approvedBy: 'Team Lead' },
    { id: 'lr-002', agentId: 'Ben Carter', type: 'sick', startDate: '2026-03-25', endDate: '2026-03-26', daysRequested: 2, status: 'approved' },
    { id: 'lr-003', agentId: 'Daniel Reyes', type: 'paid', startDate: '2026-03-30', endDate: '2026-04-01', daysRequested: 3, status: 'blocked', blockReason: 'Week 14 at capacity', alternativeDates: ['2026-04-06', '2026-04-13'] },
    { id: 'lr-004', agentId: 'Grace Kim', type: 'training', startDate: '2026-04-08', endDate: '2026-04-08', daysRequested: 1, status: 'pending' },
    { id: 'lr-005', agentId: 'Hasan Ali', type: 'paid', startDate: '2026-04-14', endDate: '2026-04-17', daysRequested: 4, status: 'pending' },
]

type CheckResult = { pass: boolean; message: string }

function runLeaveChecks(start: string, end: string): CheckResult[] {
    if (!start || !end) return []
    const startDate = new Date(start)
    const days = Math.max(1, Math.ceil((new Date(end).getTime() - startDate.getTime()) / 86_400_000) + 1)
    const weekNum = Math.ceil((startDate.getDate()) / 7)

    const checks: CheckResult[] = [
        {
            pass: 16 >= days,
            message: `Leave balance: 16 days remaining — need ${days} day${days !== 1 ? 's' : ''}. ${16 >= days ? 'Pass ✓' : 'Insufficient balance ✗'}`,
        },
        {
            pass: start < '2026-04-06' ? false : true,
            message: start < '2026-04-06'
                ? 'Week 14 at capacity (0 slots remaining) — leave blocked for 30 Mar–3 Apr. ✗'
                : `Slot availability: ${weekNum <= 15 ? '4 slots remaining' : '3 slots remaining'} this week. Pass ✓`,
        },
        {
            pass: start !== '2026-03-26',
            message: start === '2026-03-26'
                ? 'Skills gap: You are the only Tier-2 certified agent on Thu 14:00–18:00. Friday blocked — alternative: Wed–Thu available. ⚠'
                : 'Skills coverage check: no gaps for selected dates. Pass ✓',
        },
    ]
    return checks
}

const statusVariant: Record<string, 'green' | 'amber' | 'red' | 'grey'> = {
    approved: 'green', pending: 'amber', blocked: 'red', cancelled: 'grey',
}

export default function LeavePage() {
    const [requests, setRequests] = useState<LeaveRequest[]>(INITIAL_REQUESTS)
    const [showForm, setShowForm] = useState(false)
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [checkResults, setCheckResults] = useState<CheckResult[]>([])
    const [submitted, setSubmitted] = useState(false)

    const pending = requests.filter((r) => r.status === 'pending').length
    const approved = requests.filter((r) => r.status === 'approved').length
    const blocked = requests.filter((r) => r.status === 'blocked').length

    const handleCheck = () => {
        const results = runLeaveChecks(startDate, endDate)
        setCheckResults(results)
    }

    const allPass = checkResults.length > 0 && checkResults.every((c) => c.pass)
    const hasSkillsBlock = checkResults.some((c) => !c.pass && c.message.includes('Tier-2'))

    const handleSubmit = () => {
        if (!startDate || !endDate) return
        const days = Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86_400_000) + 1)
        if (hasSkillsBlock) {
            const altStart = '2026-03-25'
            const altEnd = '2026-03-26'
            setRequests((prev) => [
                ...prev,
                {
                    id: `lr-new-${Date.now()}`,
                    agentId: 'Agent #12',
                    type: 'paid',
                    startDate: altStart,
                    endDate: altEnd,
                    daysRequested: 2,
                    status: 'approved',
                    approvedBy: 'System (auto-approved)',
                },
            ])
            toast.success('Leave approved for Wed–Thu', { description: 'Friday blocked due to Tier-2 skills gap. Alternative dates Wed–Thu auto-approved.' })
        } else if (allPass) {
            setRequests((prev) => [
                ...prev,
                { id: `lr-new-${Date.now()}`, agentId: 'Agent #12', type: 'paid', startDate, endDate, daysRequested: days, status: 'approved', approvedBy: 'System' },
            ])
            toast.success('Leave approved', { description: `${days} day${days !== 1 ? 's' : ''} leave approved. Balance updated: ${16 - days} days remaining.` })
        } else {
            toast.error('Leave blocked', { description: 'One or more checks failed. See details.' })
        }
        setSubmitted(true)
        setShowForm(false)
        setCheckResults([])
        setStartDate('')
        setEndDate('')
    }

    return (
        <DashboardTemplate
            title="Leave Management"
            statCards={
                <>
                    <StatCard label="Pending Requests" value={pending} variant="amber" />
                    <StatCard label="Approved" value={approved} variant="green" />
                    <StatCard label="Blocked" value={blocked} variant="red" />
                    <StatCard label="Leave Balance (Agent #12)" value="16 days" variant="green" trendValue="4 used this year" />
                </>
            }
            actions={
                <Button size="sm" onClick={() => { setShowForm(true); setCheckResults([]); setSubmitted(false) }}>
                    Request Leave
                </Button>
            }
        >
            <div className="space-y-6">
                {/* Interactive leave request form */}
                {showForm && (
                    <Card className="border-brand-primary/30">
                        <h2 className="mb-4 text-sm font-semibold">Apply for Paid Leave — Agent #12</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-xs font-medium text-brand-gray">Start Date</label>
                                <Input type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); setCheckResults([]) }} />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium text-brand-gray">End Date</label>
                                <Input type="date" value={endDate} onChange={(e) => { setEndDate(e.target.value); setCheckResults([]) }} />
                            </div>
                        </div>

                        <div className="mt-4 flex gap-2">
                            <Button size="sm" variant="ghost" onClick={handleCheck} disabled={!startDate || !endDate}>
                                Run eligibility checks
                            </Button>
                            {checkResults.length > 0 && (
                                <Button size="sm" onClick={handleSubmit}>
                                    Submit request
                                </Button>
                            )}
                            <Button size="sm" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
                        </div>

                        {checkResults.length > 0 && (
                            <div className="mt-4 space-y-2">
                                <p className="text-xs font-semibold text-brand-gray uppercase tracking-wide">Eligibility check results</p>
                                {checkResults.map((r, i) => (
                                    <div key={i} className={`flex items-start gap-2 rounded-lg px-3 py-2 text-xs ${r.pass ? 'bg-status-green/10 text-status-green' : 'bg-status-amber/10 text-status-amber'}`}>
                                        {r.pass ? <CheckCircle2 size={14} className="mt-0.5 shrink-0" /> : <AlertTriangle size={14} className="mt-0.5 shrink-0" />}
                                        {r.message}
                                    </div>
                                ))}
                                {hasSkillsBlock && (
                                    <AlertBanner variant="amber" message="Friday blocked — skills gap detected. System will auto-approve Wed–Thu instead. Click Submit to confirm alternative dates." />
                                )}
                            </div>
                        )}
                    </Card>
                )}

                {submitted && (
                    <AlertBanner variant="amber" message="Leave request processed. Check the requests table below for the outcome." dismissible />
                )}

                <LeaveCapacityCalendar weeks={mockWeeks} />

                {smartPushWeek && (
                    <SmartLeavePush week={smartPushWeek} suggestedAgents={suggestedAgents} />
                )}

                <Card>
                    <h2 className="mb-4 text-sm font-semibold">Leave Requests</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-surface-border text-left text-xs text-brand-gray">
                                    <th className="pb-3 pr-4 font-medium">Agent</th>
                                    <th className="pb-3 pr-4 font-medium">Type</th>
                                    <th className="pb-3 pr-4 font-medium">Dates</th>
                                    <th className="pb-3 pr-4 font-medium">Days</th>
                                    <th className="pb-3 pr-4 font-medium">Status</th>
                                    <th className="pb-3 font-medium">Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map((req) => (
                                    <tr key={req.id} className="border-b border-surface-border last:border-0">
                                        <td className="py-3 pr-4 font-medium">{req.agentId}</td>
                                        <td className="py-3 pr-4 capitalize">{req.type}</td>
                                        <td className="py-3 pr-4">{req.startDate} — {req.endDate}</td>
                                        <td className="py-3 pr-4">{req.daysRequested}</td>
                                        <td className="py-3 pr-4">
                                            <Badge variant={statusVariant[req.status]}>{req.status.toUpperCase()}</Badge>
                                        </td>
                                        <td className="py-3 text-xs text-brand-gray">
                                            {req.blockReason && <span>{req.blockReason}{req.alternativeDates && <span className="ml-1 text-brand-green">Alt: {req.alternativeDates.join(', ')}</span>}</span>}
                                            {req.approvedBy && <span>Approved by {req.approvedBy}</span>}
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
