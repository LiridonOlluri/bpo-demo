'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { DashboardTemplate } from '@/components/templates/DashboardTemplate'
import { AttendanceGrid } from '@/components/organisms/AttendanceGrid'
import { AlertBanner } from '@/components/molecules/AlertBanner'
import { StatCard } from '@/components/molecules/StatCard'
import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import { AiFeatureLock } from '@/components/molecules/AiFeatureLock'
import { useRole } from '@/hooks/useRole'
import { Clock, CheckCircle2, AlertCircle, Calendar, TrendingUp, ArrowLeftRight } from 'lucide-react'

/* UC-2D — TL Shift Change Approval widget */
function ShiftChangeApproval() {
    const [status, setStatus] = useState<'pending' | 'approved' | 'declined'>('pending')

    if (status !== 'pending') {
        return (
            <AlertBanner
                variant="amber"
                message={status === 'approved'
                    ? 'Shift swap approved. Agent #12 and Agent #33 schedules updated instantly for Thursday.'
                    : 'Shift swap declined. Agents notified.'}
                dismissible
            />
        )
    }

    return (
        <Card className="border-blue-200 bg-blue-50/40">
            <div className="flex items-center gap-2 mb-3">
                <ArrowLeftRight size={16} className="text-blue-600" />
                <h3 className="text-sm font-semibold">Pending Shift Change Request — UC-2D</h3>
                <Badge variant="blue">1 pending</Badge>
            </div>
            <div className="rounded-lg border border-blue-200 bg-white p-3 text-sm space-y-2">
                <p><span className="font-medium">Agent #12</span> requests shift swap with <span className="font-medium">Agent #33</span> for <span className="font-medium">Thursday</span></p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded bg-surface-muted p-2">
                        <p className="text-brand-gray">Agent #12 swap from</p>
                        <p className="font-medium">Early 07:00–15:00</p>
                    </div>
                    <div className="rounded bg-surface-muted p-2">
                        <p className="text-brand-gray">Agent #33 swap from</p>
                        <p className="font-medium">Mid 10:00–18:00</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                    <Badge variant="green">Compliance check: passed</Badge>
                    <Badge variant="green">Skills coverage: maintained</Badge>
                    <Badge variant="green">Agent #33: accepted</Badge>
                </div>
            </div>
            <div className="mt-3 flex gap-2">
                <Button size="sm" onClick={() => { setStatus('approved'); toast.success('Shift swap approved', { description: 'Both agents notified. Schedules updated.' }) }}>
                    <CheckCircle2 size={14} /> Approve
                </Button>
                <Button size="sm" variant="ghost" onClick={() => { setStatus('declined'); toast.info('Shift swap declined') }}>
                    Decline
                </Button>
            </div>
        </Card>
    )
}

type AttendanceStatus = 'on-time' | 'late' | 'absent' | 'ncns' | 'on-leave' | 'not-started'

const mockAgents: { id: string; name: string; status: AttendanceStatus; tardiness?: number; team?: string; shift?: string }[] = [
    { id: 'a01', name: 'Alice Monroe', status: 'on-time', team: 'Team A', shift: 'Early 07:00-15:00' },
    { id: 'a02', name: 'Ben Carter', status: 'on-time', team: 'Team A', shift: 'Early 07:00-15:00' },
    { id: 'a03', name: 'Clara Singh', status: 'on-time', team: 'Team A', shift: 'Early 07:00-15:00' },
    { id: 'a04', name: 'Daniel Reyes', status: 'on-time', team: 'Team A', shift: 'Early 07:00-15:00' },
    { id: 'a05', name: 'Ella Brooks', status: 'on-time', team: 'Team B', shift: 'Early 07:00-15:00' },
    { id: 'a06', name: 'Frank Osei', status: 'on-time', team: 'Team B', shift: 'Early 07:00-15:00' },
    { id: 'a07', name: 'Grace Kim', status: 'on-time', team: 'Team B', shift: 'Early 07:00-15:00' },
    { id: 'a08', name: 'Hasan Ali', status: 'on-time', team: 'Team B', shift: 'Early 07:00-15:00' },
    { id: 'a09', name: 'Isla Novak', status: 'on-time', team: 'Team C', shift: 'Early 07:00-15:00' },
    { id: 'a10', name: 'James Patel', status: 'on-time', team: 'Team C', shift: 'Early 07:00-15:00' },
    { id: 'a11', name: 'Karen Müller', status: 'on-time', team: 'Team C', shift: 'Early 07:00-15:00' },
    { id: 'a12', name: "Liam O'Brien", status: 'on-time', team: 'Team D', shift: 'Early 07:00-15:00' },
    { id: 'a13', name: 'Maya Johnson', status: 'on-time', team: 'Team D', shift: 'Early 07:00-15:00' },
    { id: 'a14', name: 'Nina Kowalski', status: 'on-time', team: 'Team D', shift: 'Early 07:00-15:00' },
    { id: 'a15', name: 'Oscar Tran', status: 'on-time', team: 'Team E', shift: 'Early 07:00-15:00' },
    { id: 'a16', name: 'Priya Sharma', status: 'late', tardiness: 7, team: 'Team B', shift: 'Early 07:00-15:00' },
    { id: 'a17', name: 'Quinn Davis', status: 'late', tardiness: 12, team: 'Team D', shift: 'Early 07:00-15:00' },
    { id: 'a18', name: 'Ryan Costa', status: 'ncns', team: 'Team B', shift: 'Early 07:00-15:00' },
]

const totalScheduled = mockAgents.length
const loggedIn = mockAgents.filter((a) => a.status !== 'ncns' && a.status !== 'absent').length
const onTime = mockAgents.filter((a) => a.status === 'on-time').length
const late = mockAgents.filter((a) => a.status === 'late').length
const absent = mockAgents.filter((a) => a.status === 'absent').length
const ncns = mockAgents.filter((a) => a.status === 'ncns').length
const onTimeRate = ((onTime / totalScheduled) * 100).toFixed(1)

/* ─── L1 Agent #12 personal demo data ─────────────────────────────────── */
const AGENT_DEMO = {
    name: 'Agent #12',
    team: 'Team A',
    teamLead: 'Sarah Chen',
    client: 'Client A',
    shift: 'Early 07:00-15:00',
    clockedIn: false,
    missingMinutes: 3,
    leaveBalance: 16,
    leaveUsed: 4,
    onTimeRate: '90%',
    onTimeCount: '18/20',
    breakCompliance: '95%',
    lunchCompliance: '100%',
    scheduleAdherence: '91%',
    nextShifts: [
        { date: 'Wed 26 Mar', shift: 'Early 07:00-15:00' },
        { date: 'Thu 27 Mar', shift: 'Mid 10:00-18:00' },
        { date: 'Fri 28 Mar', shift: 'Early 07:00-15:00' },
        { date: 'Mon 31 Mar', shift: 'Early 07:00-15:00' },
        { date: 'Tue 1 Apr', shift: 'Late 16:00-00:00' },
    ],
}

function AgentDashboard() {
    const [clockedIn, setClockedIn] = useState(AGENT_DEMO.clockedIn)
    const [runningLate, setRunningLate] = useState(false)
    const [lateTapped, setLateTapped] = useState(false)

    const handleClockIn = () => {
        setClockedIn(true)
        toast.success('Clocked in', { description: 'Recorded 07:08 — 3 min late after 5 min grace period deducted.' })
    }

    const handleRunningLate = () => {
        setLateTapped(true)
        toast.info('Running late notification sent', { description: 'ETA sent to Team Lead Sarah Chen.' })
    }

    return (
        <DashboardTemplate
            title="My Dashboard"
            statCards={
                <>
                    <StatCard label="Leave Balance" value={`${AGENT_DEMO.leaveBalance} days`} variant="green" trendValue={`${AGENT_DEMO.leaveUsed} used this year`} />
                    <StatCard label="Missing Minutes" value={`${AGENT_DEMO.missingMinutes} min`} variant={AGENT_DEMO.missingMinutes > 0 ? 'amber' : 'green'} trendValue={AGENT_DEMO.missingMinutes > 0 ? 'OT blocked until cleared' : 'OT eligible'} />
                    <StatCard label="On-Time Rate" value={AGENT_DEMO.onTimeRate} variant="green" trendValue={AGENT_DEMO.onTimeCount} />
                    <StatCard label="Schedule Adherence" value={AGENT_DEMO.scheduleAdherence} variant="green" />
                    <StatCard label="Break Compliance" value={AGENT_DEMO.breakCompliance} variant="green" />
                </>
            }
        >
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Clock in / Running late */}
                <Card className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <Clock size={18} className="text-brand-gray" />
                        <h2 className="text-sm font-semibold">Today&apos;s Shift</h2>
                    </div>
                    <div className="rounded-lg bg-surface-muted p-3 text-sm">
                        <p className="font-medium">{AGENT_DEMO.shift}</p>
                        <p className="text-xs text-brand-gray mt-0.5">{AGENT_DEMO.team} · {AGENT_DEMO.client}</p>
                        <p className="text-xs text-brand-gray">TL: {AGENT_DEMO.teamLead}</p>
                    </div>
                    {!clockedIn ? (
                        <div className="space-y-2">
                            <Button className="w-full" onClick={handleClockIn}>
                                <CheckCircle2 size={16} />
                                Clock In
                            </Button>
                            {!lateTapped ? (
                                <Button variant="ghost" className="w-full text-status-amber" onClick={handleRunningLate}>
                                    <AlertCircle size={16} />
                                    Running Late — tap to notify TL
                                </Button>
                            ) : (
                                <AlertBanner variant="amber" message="TL notified. Please clock in when you arrive." />
                            )}
                        </div>
                    ) : (
                        <AlertBanner variant="amber" message="Clocked in at 07:08. 3 min tardiness recorded (after 5 min grace). Missing minutes balance: 3." />
                    )}
                    {AGENT_DEMO.missingMinutes > 0 && (
                        <div className="rounded-lg border border-status-amber/30 bg-status-amber/5 p-3 text-xs">
                            <p className="font-semibold text-status-amber">Missing minutes: {AGENT_DEMO.missingMinutes} min</p>
                            <p className="text-brand-gray mt-0.5">Arrive {AGENT_DEMO.missingMinutes} min early on your next shift to clear this balance. OT bidding is blocked until cleared.</p>
                        </div>
                    )}
                </Card>

                {/* Compliance stats */}
                <Card className="space-y-3">
                    <div className="flex items-center gap-2">
                        <TrendingUp size={18} className="text-brand-gray" />
                        <h2 className="text-sm font-semibold">My Compliance — This Month</h2>
                    </div>
                    <ul className="space-y-2 text-sm">
                        {[
                            { label: 'On-Time Arrivals', value: AGENT_DEMO.onTimeCount, variant: 'green' as const },
                            { label: 'Break Compliance', value: AGENT_DEMO.breakCompliance, variant: 'green' as const },
                            { label: 'Lunch Compliance', value: AGENT_DEMO.lunchCompliance, variant: 'green' as const },
                            { label: 'Schedule Adherence', value: AGENT_DEMO.scheduleAdherence, variant: 'green' as const },
                            { label: 'Missing Minutes', value: `${AGENT_DEMO.missingMinutes} min`, variant: AGENT_DEMO.missingMinutes > 0 ? 'amber' as const : 'green' as const },
                            { label: 'OT Eligibility', value: AGENT_DEMO.missingMinutes === 0 ? 'Eligible' : 'Blocked', variant: AGENT_DEMO.missingMinutes > 0 ? 'red' as const : 'green' as const },
                        ].map((row) => (
                            <li key={row.label} className="flex items-center justify-between">
                                <span className="text-brand-gray">{row.label}</span>
                                <Badge variant={row.variant}>{row.value}</Badge>
                            </li>
                        ))}
                    </ul>
                    <div className="pt-2 border-t border-surface-border">
                        <Button variant="ghost" size="sm" className="w-full" onClick={() => toast.info('Payslip', { description: 'Navigating to your Work Invoice PDF...' })}>
                            View Payslip / Work Invoice PDF
                        </Button>
                    </div>
                </Card>

                {/* Upcoming shifts */}
                <Card className="space-y-3">
                    <div className="flex items-center gap-2">
                        <Calendar size={18} className="text-brand-gray" />
                        <h2 className="text-sm font-semibold">My Schedule — Next 5 Shifts</h2>
                    </div>
                    <ul className="space-y-2 text-sm">
                        {AGENT_DEMO.nextShifts.map((s) => (
                            <li key={s.date} className="flex items-center justify-between rounded-lg bg-surface-muted px-3 py-2">
                                <span className="font-medium text-xs">{s.date}</span>
                                <Badge variant="grey">{s.shift}</Badge>
                            </li>
                        ))}
                    </ul>
                    <div className="flex gap-2 pt-1 border-t border-surface-border">
                        <Button size="sm" className="flex-1" onClick={() => toast.info('Leave request', { description: 'Opening leave request form...' })}>
                            Request Leave
                        </Button>
                        <Button size="sm" variant="ghost" className="flex-1" onClick={() => toast.info('Shift swap', { description: 'Opening shift swap request...' })}>
                            Swap Shift
                        </Button>
                    </div>
                </Card>
            </div>
        </DashboardTemplate>
    )
}

export default function AttendancePage() {
    const { level } = useRole()

    if (level === 1) {
        return <AgentDashboard />
    }

    return (
        <DashboardTemplate
            title="Attendance — Early Shift (07:00-15:00)"
            statCards={
                <>
                    <StatCard label="Total Scheduled" value={totalScheduled} variant="default" />
                    <StatCard label="Logged In" value={loggedIn} variant="green" />
                    <StatCard label="On-Time Rate" value={`${onTimeRate}%`} variant={Number(onTimeRate) >= 90 ? 'green' : 'amber'} />
                    <StatCard label="Late" value={late} variant="amber" />
                    <StatCard label="Absent" value={absent} variant={absent > 0 ? 'red' : 'default'} />
                    <StatCard label="NCNS" value={ncns} variant={ncns > 0 ? 'red' : 'default'} />
                </>
            }
        >
            <div className="space-y-4">
                {ncns > 0 && (
                    <AlertBanner
                        variant="red"
                        message="NCNS Alert: Ryan Costa (Team B) has not logged in and made no contact. Sick-leave check or disciplinary path triggered. Escalation to TL Marcus Jones."
                    />
                )}

                <AlertBanner
                    variant="amber"
                    message="SL Projection: With 15/18 agents, projected SL for 07:00-08:00 = 74% (target 80%). Suggestion: extend 2 agents from overnight or offer early start to Mid-shift agents."
                />

                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-semibold">Shrinkage Impact — This Interval</h3>
                            <p className="text-xs text-brand-gray mt-1">
                                3 agents late/absent → unplanned shrinkage spiked from planned 9% to <span className="font-semibold text-status-red">14%</span> for this interval
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Badge variant="amber">Tardiness: 7 min, 12 min → payroll deduction flagged</Badge>
                            <Badge variant="red">NCNS: 1 agent → replacement search active</Badge>
                        </div>
                    </div>
                </Card>

                {/* UC-2D — Shift Change Approval */}
                <ShiftChangeApproval />

                <AttendanceGrid agents={mockAgents} />

                {/* Bradford Factor summary */}
                <Card>
                    <h3 className="text-sm font-semibold mb-3">Bradford Factor — Absence Pattern Flags</h3>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="rounded-lg border border-surface-border p-3">
                            <p className="text-xs text-brand-gray">Ryan Costa</p>
                            <p className="text-lg font-bold text-status-red">186</p>
                            <p className="text-xs text-brand-gray">3 spells × 8 days — return-to-work interview required</p>
                            <Badge variant="red" className="mt-1">Mon/Fri pattern detected</Badge>
                        </div>
                        <div className="rounded-lg border border-surface-border p-3">
                            <p className="text-xs text-brand-gray">Priya Sharma</p>
                            <p className="text-lg font-bold text-status-amber">72</p>
                            <p className="text-xs text-brand-gray">2 spells × 3 days — return-to-work conversation prompt</p>
                        </div>
                        <div className="rounded-lg border border-surface-border p-3">
                            <p className="text-xs text-brand-gray">Quinn Davis</p>
                            <p className="text-lg font-bold text-status-green">24</p>
                            <p className="text-xs text-brand-gray">1 spell × 2 days — no action required</p>
                        </div>
                    </div>
                </Card>

                <AiFeatureLock title="Predictive Absence Risk" description="AI model predicts which agents are likely to be absent tomorrow based on historical patterns, weather, and day-of-week clustering" />
            </div>
        </DashboardTemplate>
    )
}
