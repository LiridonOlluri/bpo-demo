'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { useRole } from '@/hooks/useRole'
import { LeaveCapacityCalendar } from '@/components/organisms/LeaveCapacityCalendar'
import { SmartLeavePush } from '@/components/organisms/SmartLeavePush'
import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { StatCard } from '@/components/molecules/StatCard'
import { AlertBanner } from '@/components/molecules/AlertBanner'
import type { LeaveCapacityWeek, LeaveRequest } from '@/types/leave'
import { CheckCircle2, AlertTriangle, XCircle, CalendarDays } from 'lucide-react'

// ─── Shared data ──────────────────────────────────────────────────────────────
const MOCK_WEEKS: LeaveCapacityWeek[] = [
    { weekNumber: 13, startDate: '2026-03-23', slotsAvailable: 4, slotsUsed: 3, slotsRemaining: 1, status: 'amber', volumeForecastDelta: 2, smartPushActive: false },
    { weekNumber: 14, startDate: '2026-03-30', slotsAvailable: 4, slotsUsed: 4, slotsRemaining: 0, status: 'red', volumeForecastDelta: 5, smartPushActive: false },
    { weekNumber: 15, startDate: '2026-04-06', slotsAvailable: 5, slotsUsed: 1, slotsRemaining: 4, status: 'green', volumeForecastDelta: -12, smartPushActive: true },
    { weekNumber: 16, startDate: '2026-04-13', slotsAvailable: 5, slotsUsed: 2, slotsRemaining: 3, status: 'green', volumeForecastDelta: -3, smartPushActive: false },
    { weekNumber: 17, startDate: '2026-04-20', slotsAvailable: 4, slotsUsed: 2, slotsRemaining: 2, status: 'green', volumeForecastDelta: 0, smartPushActive: false },
    { weekNumber: 18, startDate: '2026-04-27', slotsAvailable: 4, slotsUsed: 3, slotsRemaining: 1, status: 'amber', volumeForecastDelta: 8, smartPushActive: false },
    { weekNumber: 19, startDate: '2026-05-04', slotsAvailable: 5, slotsUsed: 1, slotsRemaining: 4, status: 'green', volumeForecastDelta: -5, smartPushActive: false },
    { weekNumber: 20, startDate: '2026-05-11', slotsAvailable: 5, slotsUsed: 0, slotsRemaining: 5, status: 'green', volumeForecastDelta: -8, smartPushActive: false },
]

const SMART_PUSH_WEEK = MOCK_WEEKS.find((w) => w.smartPushActive)!
const SUGGESTED_AGENTS = [
    { name: 'Karen Müller', leaveBalance: 14 },
    { name: 'Oscar Tran', leaveBalance: 11 },
    { name: 'Ella Brooks', leaveBalance: 9 },
]

const TEAM_REQUESTS: LeaveRequest[] = [
    { id: 'lr-001', agentId: 'Alice Monroe', type: 'paid', startDate: '2026-03-30', endDate: '2026-04-03', daysRequested: 5, status: 'approved', approvedBy: 'Team Lead' },
    { id: 'lr-002', agentId: 'Ben Carter', type: 'sick', startDate: '2026-03-25', endDate: '2026-03-26', daysRequested: 2, status: 'approved' },
    { id: 'lr-003', agentId: 'Daniel Reyes', type: 'paid', startDate: '2026-03-30', endDate: '2026-04-01', daysRequested: 3, status: 'blocked', blockReason: 'Week 14 at capacity', alternativeDates: ['2026-04-06', '2026-04-13'] },
    { id: 'lr-004', agentId: 'Grace Kim', type: 'training', startDate: '2026-04-08', endDate: '2026-04-08', daysRequested: 1, status: 'pending' },
    { id: 'lr-005', agentId: 'Hasan Ali', type: 'paid', startDate: '2026-04-14', endDate: '2026-04-17', daysRequested: 4, status: 'pending' },
    { id: 'lr-006', agentId: 'Lena Fischer', type: 'paid', startDate: '2026-04-21', endDate: '2026-04-24', daysRequested: 4, status: 'pending' },
    { id: 'lr-007', agentId: 'Marco Polo', type: 'sick', startDate: '2026-03-28', endDate: '2026-03-28', daysRequested: 1, status: 'approved' },
    { id: 'lr-008', agentId: 'Nina White', type: 'paid', startDate: '2026-05-05', endDate: '2026-05-07', daysRequested: 3, status: 'pending' },
]

const MY_REQUESTS: LeaveRequest[] = [
    { id: 'my-001', agentId: 'Agent #12', type: 'paid', startDate: '2026-04-14', endDate: '2026-04-16', daysRequested: 3, status: 'approved', approvedBy: 'Team Lead' },
    { id: 'my-002', agentId: 'Agent #12', type: 'sick', startDate: '2026-03-10', endDate: '2026-03-10', daysRequested: 1, status: 'approved' },
]

const STATUS_VARIANT: Record<string, 'green' | 'amber' | 'red' | 'grey'> = {
    approved: 'green', pending: 'amber', blocked: 'red', cancelled: 'grey',
}

type CheckResult = { pass: boolean; message: string }

function runLeaveChecks(start: string, end: string): CheckResult[] {
    if (!start || !end) return []
    const startDate = new Date(start)
    const days = Math.max(1, Math.ceil((new Date(end).getTime() - startDate.getTime()) / 86_400_000) + 1)
    return [
        {
            pass: 16 >= days,
            message: `Leave balance: 16 days remaining — need ${days} day${days !== 1 ? 's' : ''}. ${16 >= days ? 'Pass ✓' : 'Insufficient balance ✗'}`,
        },
        {
            pass: start >= '2026-04-06',
            message: start < '2026-04-06'
                ? 'Week 14 at capacity (0 slots remaining) — leave blocked for 30 Mar–3 Apr. ✗'
                : 'Slot availability: 4 slots remaining this week. Pass ✓',
        },
        {
            pass: start !== '2026-03-26',
            message: start === '2026-03-26'
                ? 'Skills gap: You are the only Tier-2 certified agent on Thu 14:00–18:00. Friday blocked — alternative: Wed–Thu available. ⚠'
                : 'Skills coverage check: no gaps for selected dates. Pass ✓',
        },
    ]
}

// ─── L1 — own leave data ──────────────────────────────────────────────────────
function L1Leave() {
    const [requests, setRequests] = useState<LeaveRequest[]>(MY_REQUESTS)
    const [showForm, setShowForm] = useState(false)
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [checkResults, setCheckResults] = useState<CheckResult[]>([])
    const [submitted, setSubmitted] = useState(false)

    const allPass = checkResults.length > 0 && checkResults.every((c) => c.pass)
    const hasSkillsBlock = checkResults.some((c) => !c.pass && c.message.includes('Tier-2'))

    const handleCheck = () => setCheckResults(runLeaveChecks(startDate, endDate))

    const handleSubmit = () => {
        if (!startDate || !endDate) return
        const days = Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86_400_000) + 1)
        if (hasSkillsBlock) {
            setRequests((prev) => [...prev, {
                id: `lr-${Date.now()}`, agentId: 'Agent #12', type: 'paid',
                startDate: '2026-03-25', endDate: '2026-03-26', daysRequested: 2,
                status: 'approved', approvedBy: 'System (auto-approved)',
            }])
            toast.success('Leave approved for Wed–Thu', { description: 'Friday blocked due to Tier-2 skills gap. Alternative dates Wed–Thu auto-approved.' })
        } else if (allPass) {
            setRequests((prev) => [...prev, {
                id: `lr-${Date.now()}`, agentId: 'Agent #12', type: 'paid',
                startDate, endDate, daysRequested: days,
                status: 'approved', approvedBy: 'System',
            }])
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
        <div className="space-y-5">
            {/* Own leave summary cards */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatCard label="Leave Balance" value="16 days" variant="green" trendValue="4 used this year" />
                <StatCard label="Approved" value={requests.filter(r => r.status === 'approved').length} variant="green" />
                <StatCard label="Pending" value={requests.filter(r => r.status === 'pending').length} variant="amber" />
                <StatCard label="Sick Days Used" value="1" variant="default" trendValue="This year" />
            </div>

            {/* Request leave button */}
            <div className="flex justify-end">
                <Button size="sm" onClick={() => { setShowForm(true); setCheckResults([]); setSubmitted(false) }}>
                    <CalendarDays size={14} className="mr-1.5" /> Request Leave
                </Button>
            </div>

            {/* Leave request form */}
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
                    <div className="mt-4 flex flex-wrap gap-2">
                        <Button size="sm" variant="ghost" onClick={handleCheck} disabled={!startDate || !endDate}>
                            Run eligibility checks
                        </Button>
                        {checkResults.length > 0 && (
                            <Button size="sm" onClick={handleSubmit}>Submit request</Button>
                        )}
                        <Button size="sm" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
                    </div>
                    {checkResults.length > 0 && (
                        <div className="mt-4 space-y-2">
                            <p className="text-xs font-semibold uppercase tracking-wide text-brand-gray">Eligibility check results</p>
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

            {/* My Leave History */}
            <Card>
                <h2 className="mb-4 text-sm font-semibold">My Leave Requests</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-surface-border text-left text-xs text-brand-gray">
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
                                    <td className="py-3 pr-4 capitalize">{req.type}</td>
                                    <td className="py-3 pr-4">{req.startDate} — {req.endDate}</td>
                                    <td className="py-3 pr-4">{req.daysRequested}</td>
                                    <td className="py-3 pr-4">
                                        <Badge variant={STATUS_VARIANT[req.status]}>{req.status.toUpperCase()}</Badge>
                                    </td>
                                    <td className="py-3 text-xs text-brand-gray">
                                        {req.blockReason && <span>{req.blockReason}{req.alternativeDates && <span className="ml-1 text-status-green"> Alt: {req.alternativeDates.join(', ')}</span>}</span>}
                                        {req.approvedBy && <span>Approved by {req.approvedBy}</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Read-only capacity calendar (own context) */}
            <Card>
                <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-sm font-semibold">Team Capacity Calendar</h2>
                    <Badge variant="grey">View only</Badge>
                </div>
                <p className="mb-3 text-xs text-brand-gray">Shows how many leave slots are available per week. Weeks marked red are at capacity — new requests will be blocked.</p>
                <LeaveCapacityCalendar weeks={MOCK_WEEKS} />
            </Card>
        </div>
    )
}

// ─── L2 — team grid + smart leave push ────────────────────────────────────────
function L2Leave() {
    const [requests, setRequests] = useState<LeaveRequest[]>(TEAM_REQUESTS)

    const pending = requests.filter((r) => r.status === 'pending')
    const approved = requests.filter((r) => r.status === 'approved')
    const blocked = requests.filter((r) => r.status === 'blocked')

    const approve = (id: string) => {
        setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: 'approved', approvedBy: 'Team Lead' } : r))
        toast.success('Leave approved')
    }

    const deny = (id: string) => {
        setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: 'blocked', blockReason: 'Denied by Team Lead' } : r))
        toast.error('Leave denied')
    }

    return (
        <div className="space-y-5">
            {/* Team leave summary */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatCard label="Pending Approval" value={pending.length} variant="amber" />
                <StatCard label="Approved" value={approved.length} variant="green" />
                <StatCard label="Blocked" value={blocked.length} variant="red" />
                <StatCard label="Active Smart Push" value="1 week" variant="default" trendValue="W/C 07 Apr" />
            </div>

            {/* Pending actions banner */}
            {pending.length > 0 && (
                <AlertBanner
                    variant="amber"
                    message={`${pending.length} leave request${pending.length !== 1 ? 's' : ''} pending your approval.`}
                />
            )}

            {/* Team leave requests with approve/deny */}
            <Card padding={false}>
                <div className="border-b border-surface-border p-4">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-gray">Team Leave Requests</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-surface-border text-left text-xs text-brand-gray">
                                <th className="p-3 font-medium">Agent</th>
                                <th className="p-3 font-medium">Type</th>
                                <th className="p-3 font-medium">Dates</th>
                                <th className="p-3 font-medium text-right">Days</th>
                                <th className="p-3 font-medium">Status</th>
                                <th className="p-3 font-medium">Notes</th>
                                <th className="p-3 font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((req) => (
                                <tr key={req.id} className="border-b border-surface-border last:border-0 hover:bg-surface-muted/40">
                                    <td className="p-3 font-medium">{req.agentId}</td>
                                    <td className="p-3 capitalize">{req.type}</td>
                                    <td className="p-3 text-xs">{req.startDate} — {req.endDate}</td>
                                    <td className="p-3 text-right">{req.daysRequested}</td>
                                    <td className="p-3">
                                        <Badge variant={STATUS_VARIANT[req.status]}>{req.status.toUpperCase()}</Badge>
                                    </td>
                                    <td className="p-3 text-xs text-brand-gray max-w-[180px]">
                                        {req.blockReason && <span>{req.blockReason}{req.alternativeDates && <span className="ml-1 text-status-green"> Alt: {req.alternativeDates.join(', ')}</span>}</span>}
                                        {req.approvedBy && !req.blockReason && <span>By {req.approvedBy}</span>}
                                    </td>
                                    <td className="p-3">
                                        {req.status === 'pending' && (
                                            <div className="flex gap-1.5">
                                                <button
                                                    type="button"
                                                    onClick={() => approve(req.id)}
                                                    className="flex items-center gap-1 rounded-md bg-status-green/10 px-2 py-1 text-[11px] font-medium text-status-green hover:bg-status-green/20"
                                                >
                                                    <CheckCircle2 size={11} /> Approve
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => deny(req.id)}
                                                    className="flex items-center gap-1 rounded-md bg-status-red/10 px-2 py-1 text-[11px] font-medium text-status-red hover:bg-status-red/20"
                                                >
                                                    <XCircle size={11} /> Deny
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Capacity calendar */}
            <LeaveCapacityCalendar weeks={MOCK_WEEKS} />

            {/* Smart Leave Push */}
            <SmartLeavePush week={SMART_PUSH_WEEK} suggestedAgents={SUGGESTED_AGENTS} />

            {/* Per-agent balance table */}
            <Card padding={false}>
                <div className="border-b border-surface-border p-4">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-gray">Agent Leave Balances</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-surface-border text-left text-xs text-brand-gray">
                                <th className="p-3 font-medium">Agent</th>
                                <th className="p-3 font-medium text-right">Entitlement</th>
                                <th className="p-3 font-medium text-right">Used</th>
                                <th className="p-3 font-medium text-right">Remaining</th>
                                <th className="p-3 font-medium text-right">Sick Days</th>
                                <th className="p-3 font-medium">Risk</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { name: 'Alice Monroe', ent: 20, used: 5, sick: 1, risk: 'low' },
                                { name: 'Ben Carter', ent: 20, used: 2, sick: 2, risk: 'none' },
                                { name: 'Daniel Reyes', ent: 20, used: 3, sick: 0, risk: 'none' },
                                { name: 'Grace Kim', ent: 20, used: 1, sick: 0, risk: 'none' },
                                { name: 'Hasan Ali', ent: 20, used: 0, sick: 0, risk: 'high' },
                                { name: 'Lena Fischer', ent: 20, used: 0, sick: 0, risk: 'high' },
                                { name: 'Marco Polo', ent: 20, used: 1, sick: 1, risk: 'none' },
                                { name: 'Nina White', ent: 20, used: 0, sick: 0, risk: 'medium' },
                                { name: 'Oscar Tran', ent: 20, used: 9, sick: 0, risk: 'low' },
                                { name: 'Karen Müller', ent: 20, used: 6, sick: 0, risk: 'none' },
                            ].map((a) => (
                                <tr key={a.name} className="border-b border-surface-border last:border-0 hover:bg-surface-muted/40">
                                    <td className="p-3 font-medium">{a.name}</td>
                                    <td className="p-3 text-right">{a.ent}</td>
                                    <td className="p-3 text-right">{a.used}</td>
                                    <td className="p-3 text-right font-semibold">{a.ent - a.used}</td>
                                    <td className="p-3 text-right">{a.sick}</td>
                                    <td className="p-3">
                                        {a.risk === 'high'
                                            ? <Badge variant="red">High — use or lose</Badge>
                                            : a.risk === 'medium'
                                            ? <Badge variant="amber">Medium</Badge>
                                            : a.risk === 'low'
                                            ? <Badge variant="blue">Low</Badge>
                                            : <Badge variant="grey">OK</Badge>
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    )
}

// ─── Page root ────────────────────────────────────────────────────────────────
export default function LeavePage() {
    const { level } = useRole()

    return (
        <div className="space-y-1">
            <div className="mb-4">
                <h1 className="text-xl font-bold tracking-tight">Leave &amp; Calendar</h1>
                <p className="text-sm text-brand-gray">
                    {level === 1
                        ? 'My leave balance · my requests · capacity calendar'
                        : 'Team leave requests · capacity calendar · smart leave push · agent balances'}
                </p>
            </div>
            {level === 1 ? <L1Leave /> : <L2Leave />}
        </div>
    )
}
