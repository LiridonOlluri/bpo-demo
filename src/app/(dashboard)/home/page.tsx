'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { useRole } from '@/hooks/useRole'
import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import { StatCard } from '@/components/molecules/StatCard'
import { AlertBanner } from '@/components/molecules/AlertBanner'
import { AiFeatureLock } from '@/components/molecules/AiFeatureLock'
import {
    CheckCircle2,
    AlertCircle,
    Clock,
    TrendingUp,
    Calendar,
    ArrowLeftRight,
    Users,
    Activity,
    ShieldAlert,
    Zap,
    BarChart2,
    MessagesSquare,
} from 'lucide-react'

// ─── Demo data: Agent #12 (L1) ───────────────────────────────────────────────
const AGENT = {
    id: '#12',
    name: 'Agent #12',
    team: 'Team A',
    teamLead: 'Sarah Chen',
    client: 'Client A',
    shift: 'Early',
    shiftTime: '07:00–15:00',
    missingMinutes: 3,
    leaveBalance: 16,
    leaveUsed: 4,
    onTimeRate: '90%',
    onTimeCount: '18/20',
    breakCompliance: '95%',
    lunchCompliance: '100%',
    trainingAdherence: '100%',
    scheduleAdherence: '91%',
    nextShifts: [
        { date: 'Wed 26 Mar', type: 'Early', time: '07:00–15:00' },
        { date: 'Thu 27 Mar', type: 'Mid', time: '10:00–18:00' },
        { date: 'Fri 28 Mar', type: 'Early', time: '07:00–15:00' },
        { date: 'Mon 31 Mar', type: 'Early', time: '07:00–15:00' },
        { date: 'Tue 1 Apr', type: 'Late', time: '16:00–00:00' },
    ],
}

// ─── L1 Home ─────────────────────────────────────────────────────────────────
function L1Home() {
    const [clockedIn, setClockedIn] = useState(false)
    const [lateTapped, setLateTapped] = useState(false)

    const handleClockIn = () => {
        setClockedIn(true)
        toast.success('Clocked in — 07:08', {
            description: 'Tardiness: 3 min (8 min late − 5 min grace). Missing minutes balance: 0 → 3 min. Coaching ticket sent to TL.',
        })
    }

    const handleClockOut = () => {
        toast.success('Clocked out', {
            description: 'Actual: 7h 52min. Payroll updated. Work Invoice PDF ready.',
        })
    }

    const handleRunningLate = () => {
        setLateTapped(true)
        toast.info('TL notified', { description: 'ETA and reason sent to Sarah Chen.' })
    }

    const handleRequestLeave = () => {
        toast.info('Leave request', { description: 'Opening leave & calendar…' })
        window.location.href = '/attendance/leave'
    }

    const handleSwapShift = () => {
        toast.info('Shift swap', { description: 'Opening schedule grid to select a swap partner…' })
        window.location.href = '/attendance/leave'
    }

    return (
        <div className="space-y-6">
            {/* Top KPI cards */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                <StatCard
                    label="Leave Balance"
                    value={`${AGENT.leaveBalance} days`}
                    variant="green"
                    trendValue={`${AGENT.leaveUsed} used · ${20 - AGENT.leaveUsed} remaining`}
                />
                <StatCard
                    label="Missing Minutes"
                    value={`${AGENT.missingMinutes} min`}
                    variant={AGENT.missingMinutes > 0 ? 'amber' : 'green'}
                    trendValue={AGENT.missingMinutes > 0 ? 'OT blocked until cleared' : 'OT eligible'}
                />
                <StatCard
                    label="On-Time Rate"
                    value={AGENT.onTimeRate}
                    variant="green"
                    trendValue={`${AGENT.onTimeCount} this month`}
                />
                <StatCard
                    label="Schedule Adherence"
                    value={AGENT.scheduleAdherence}
                    variant="green"
                />
                <StatCard
                    label="Break & Lunch Compliance"
                    value={AGENT.breakCompliance}
                    variant="green"
                    trendValue={`Lunch: ${AGENT.lunchCompliance}`}
                />
            </div>

            {/* Missing minutes warning — conditional */}
            {AGENT.missingMinutes > 0 && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm">
                    <span className="font-semibold text-amber-700">Missing minutes: {AGENT.missingMinutes} min.</span>
                    <span className="ml-1 text-amber-600">OT bidding blocked until cleared.</span>
                </div>
            )}

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Today's Shift + Clock In/Out */}
                <Card className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <Clock size={18} className="text-brand-gray" />
                        <h2 className="text-sm font-semibold">Today&apos;s Shift</h2>
                    </div>
                    <div className="rounded-xl border border-surface-border bg-surface-muted p-3 text-sm">
                        <p className="font-semibold">{AGENT.shift} · {AGENT.shiftTime}</p>
                        <p className="mt-0.5 text-xs text-brand-gray">{AGENT.team} · {AGENT.client}</p>
                        <p className="text-xs text-brand-gray">TL: {AGENT.teamLead}</p>
                    </div>

                    {!clockedIn ? (
                        <div className="space-y-2">
                            <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-base font-semibold" onClick={handleClockIn}>
                                <CheckCircle2 size={18} />
                                Clock In
                            </Button>
                            {!lateTapped ? (
                                <button
                                    type="button"
                                    onClick={handleRunningLate}
                                    className="w-full text-center text-xs text-amber-600 underline underline-offset-2 hover:text-amber-700"
                                >
                                    Running Late — tap to notify TL
                                </button>
                            ) : (
                                <AlertBanner variant="amber" message="TL notified. You are pre-flagged as 'late with notice'. Clock in when you arrive." />
                            )}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <AlertBanner variant="amber" message="Clocked in 07:08 · 3 min tardiness · missing minutes: 3 · auto-ticket sent to TL." />
                            <Button variant="ghost" className="w-full border border-surface-border" onClick={handleClockOut}>
                                Clock Out
                            </Button>
                        </div>
                    )}

                    {AGENT.missingMinutes > 0 && (
                        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs">
                            <p className="font-semibold text-amber-700">Missing minutes: {AGENT.missingMinutes} min</p>
                            <p className="mt-0.5 text-amber-600">
                                Arrive {AGENT.missingMinutes} min early on your next shift to clear. OT bidding is blocked until cleared.
                            </p>
                        </div>
                    )}
                </Card>

                {/* My Compliance This Month */}
                <Card className="space-y-3">
                    <div className="flex items-center gap-2">
                        <TrendingUp size={18} className="text-brand-gray" />
                        <h2 className="text-sm font-semibold">My Compliance — This Month</h2>
                    </div>
                    <ul className="space-y-2 text-sm">
                        {[
                            { label: 'On-Time Arrivals', value: AGENT.onTimeCount, variant: 'green' as const },
                            { label: 'Break Compliance', value: AGENT.breakCompliance, variant: 'green' as const },
                            { label: 'Lunch Compliance', value: AGENT.lunchCompliance, variant: 'green' as const },
                            { label: 'Training Time Adherence', value: AGENT.trainingAdherence, variant: 'green' as const },
                            { label: 'Schedule Adherence', value: AGENT.scheduleAdherence, variant: 'green' as const },
                            { label: 'Missing Minutes', value: `${AGENT.missingMinutes} min`, variant: AGENT.missingMinutes > 0 ? 'amber' as const : 'green' as const },
                            { label: 'OT Eligibility', value: AGENT.missingMinutes === 0 ? 'Eligible' : 'Blocked', variant: AGENT.missingMinutes > 0 ? 'red' as const : 'green' as const },
                        ].map((row) => (
                            <li key={row.label} className="flex items-center justify-between gap-2">
                                <span className="text-brand-gray">{row.label}</span>
                                <Badge variant={row.variant}>{row.value}</Badge>
                            </li>
                        ))}
                    </ul>
                </Card>

                {/* My Schedule — Next 5 Shifts */}
                <Card className="space-y-3">
                    <div className="flex items-center gap-2">
                        <Calendar size={18} className="text-brand-gray" />
                        <h2 className="text-sm font-semibold">My Schedule — Next 5 Shifts</h2>
                    </div>
                    <ul className="space-y-1.5 text-sm">
                        {AGENT.nextShifts.map((s) => (
                            <li key={s.date} className="flex items-center justify-between rounded-lg bg-surface-muted px-3 py-2">
                                <span className="text-xs font-medium">{s.date}</span>
                                <div className="flex items-center gap-1.5">
                                    <Badge variant={s.type === 'Early' ? 'blue' : s.type === 'Mid' ? 'green' : 'amber'}>
                                        {s.type}
                                    </Badge>
                                    <span className="text-[11px] text-brand-gray">{s.time}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <Link href="/attendance/leave" className="block text-center text-xs text-brand-primary hover:underline">
                        View Full Schedule →
                    </Link>

                    {/* Quick Actions */}
                    <div className="flex gap-2 border-t border-surface-border pt-3">
                        <Button size="sm" className="flex-1" onClick={handleRequestLeave}>
                            <Calendar size={13} />
                            Request Leave
                        </Button>
                        <Button size="sm" variant="ghost" className="flex-1 border border-surface-border" onClick={handleSwapShift}>
                            <ArrowLeftRight size={13} />
                            Swap Shift
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    )
}

// ─── Demo data: Team Lead (L2) ────────────────────────────────────────────────
const TL_SHIFT = { type: 'Early', time: '07:00–15:00' }
const TL_LEAVE_BALANCE = 12

const TEAM_AGENTS: { id: string; name: string; status: AgentStatus; tardiness: number }[] = [
    { id: 'a01', name: 'Alice Monroe', status: 'on-time', tardiness: 0 },
    { id: 'a02', name: 'Ben Carter', status: 'on-time', tardiness: 0 },
    { id: 'a03', name: 'Clara Singh', status: 'on-time', tardiness: 0 },
    { id: 'a04', name: 'Daniel Reyes', status: 'on-time', tardiness: 0 },
    { id: 'a05', name: 'Ella Brooks', status: 'on-time', tardiness: 0 },
    { id: 'a06', name: 'Frank Osei', status: 'on-time', tardiness: 0 },
    { id: 'a07', name: 'Grace Kim (Agent #7)', status: 'late', tardiness: 7 },
    { id: 'a08', name: 'Hasan Ali', status: 'on-time', tardiness: 0 },
    { id: 'a09', name: 'Isla Novak', status: 'on-time', tardiness: 0 },
    { id: 'a10', name: 'Ryan Costa', status: 'ncns', tardiness: 0 },
]

type AgentStatus = 'on-time' | 'late' | 'ncns' | 'absent' | 'on-leave' | 'sick'

const STATUS_CONFIG: Record<AgentStatus, { label: string; dot: string; badge: 'green' | 'amber' | 'red' | 'grey' }> = {
    'on-time': { label: 'On time', dot: 'bg-status-green', badge: 'green' },
    late: { label: 'Late', dot: 'bg-status-amber', badge: 'amber' },
    ncns: { label: 'NCNS', dot: 'bg-status-red', badge: 'red' },
    absent: { label: 'Absent', dot: 'bg-zinc-400', badge: 'grey' },
    'on-leave': { label: 'On Leave', dot: 'bg-orange-400', badge: 'grey' },
    sick: { label: 'Sick', dot: 'bg-red-400', badge: 'red' },
}

// ─── L2 Home ─────────────────────────────────────────────────────────────────
function L2Home() {
    const [tlClockedIn, setTlClockedIn] = useState(false)
    const [otApproved, setOtApproved] = useState(false)
    const [swapStatus, setSwapStatus] = useState<'pending' | 'approved' | 'declined'>('pending')

    const totalScheduled = TEAM_AGENTS.length
    const loggedIn = TEAM_AGENTS.filter((a) => a.status !== 'ncns' && a.status !== 'absent').length
    const onTime = TEAM_AGENTS.filter((a) => a.status === 'on-time').length
    const late = TEAM_AGENTS.filter((a) => a.status === 'late').length
    const absent = TEAM_AGENTS.filter((a) => a.status === 'absent').length
    const ncns = TEAM_AGENTS.filter((a) => a.status === 'ncns').length
    const onTimeRate = ((onTime / totalScheduled) * 100).toFixed(0)

    const handleApproveOT = () => {
        setOtApproved(true)
        toast.success('OT approved — Agent #28 added to schedule', {
            description: 'WFM recalculating. SL projection improving from 74% → 79%.',
        })
    }

    const handleApproveSwap = () => {
        setSwapStatus('approved')
        toast.success('Shift swap approved', {
            description: 'Agent #12 ↔ Agent #33 Thursday swap confirmed. Both agents notified. Schedules updated.',
        })
    }

    return (
        <div className="space-y-5">
            {/* TL Personal Section */}
            <Card className="border-l-4 border-l-green-500">
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-brand-gray">My Shift</h2>
                <div className="flex flex-wrap items-center gap-4">
                    <div className="rounded-lg bg-surface-muted px-4 py-2 text-sm">
                        <span className="font-semibold">{TL_SHIFT.type} · {TL_SHIFT.time}</span>
                    </div>
                    {!tlClockedIn ? (
                        <Button size="sm" onClick={() => { setTlClockedIn(true); toast.success('TL clocked in') }}>
                            <CheckCircle2 size={14} /> Clock In
                        </Button>
                    ) : (
                        <Badge variant="green">Clocked In</Badge>
                    )}
                    <button
                        type="button"
                        className="text-xs text-amber-600 underline underline-offset-2 hover:text-amber-700"
                        onClick={() => toast.info('Running Late', { description: 'Notification sent to Ops Manager.' })}
                    >
                        Running Late
                    </button>
                    <Link href="/attendance/leave" className="text-xs text-brand-primary underline underline-offset-2">
                        Request Leave
                    </Link>
                    <span className="text-xs text-brand-gray">Leave balance: {TL_LEAVE_BALANCE} days</span>
                </div>
            </Card>

            {/* NCNS Alert Banner */}
            {ncns > 0 && (
                <AlertBanner
                    variant="red"
                    message={`NCNS Alert: Ryan Costa (Team B) — no login, no contact. Sick-leave check triggered. Escalation status: Active. SL projection dropped to 74% (target 80%).`}
                />
            )}

            {/* Team Overview KPI cards */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                <StatCard label="Total Scheduled" value={totalScheduled} variant="default" />
                <StatCard label="Logged In" value={loggedIn} variant="green" />
                <StatCard label="On-Time Rate" value={`${onTimeRate}%`} variant={Number(onTimeRate) >= 90 ? 'green' : 'amber'} />
                <StatCard label="Late" value={late} variant={late > 0 ? 'amber' : 'default'} />
                <StatCard label="Absent" value={absent} variant={absent > 0 ? 'red' : 'default'} />
                <StatCard label="NCNS" value={ncns} variant={ncns > 0 ? 'red' : 'default'} />
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
                {/* SL Projection + OT Approval */}
                <Card>
                    <div className="mb-3 flex items-center gap-2">
                        <Activity size={16} className="text-brand-gray" />
                        <h2 className="text-sm font-semibold">SL Projection</h2>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
                            <div>
                                <p className="text-sm font-semibold text-amber-700">Current SL: 74% <span className="text-xs font-normal">(target 80%)</span></p>
                                <p className="text-xs text-amber-600 mt-0.5">2 off-duty agents available for OT</p>
                            </div>
                            {!otApproved ? (
                                <Button size="sm" onClick={handleApproveOT}>
                                    <Zap size={13} /> Approve OT — Agent #28
                                </Button>
                            ) : (
                                <Badge variant="green">OT approved · SL →79%</Badge>
                            )}
                        </div>
                        <button
                            type="button"
                            className="w-full rounded-lg border border-surface-border py-2 text-xs text-brand-gray hover:bg-surface-muted"
                            onClick={() => toast.info('WFM request sent', { description: 'Request for additional staffing sent to WFM.' })}
                        >
                            Request from WFM →
                        </button>
                    </div>
                </Card>

                {/* Shrinkage Impact + Tardiness */}
                <Card>
                    <div className="mb-3 flex items-center gap-2">
                        <BarChart2 size={16} className="text-brand-gray" />
                        <h2 className="text-sm font-semibold">Shrinkage Impact — This Interval</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                        <div className="rounded-lg border border-surface-border p-2 text-center">
                            <p className="text-xs text-brand-gray">Planned</p>
                            <p className="text-lg font-bold">21%</p>
                        </div>
                        <div className="rounded-lg border border-amber-200 bg-amber-50 p-2 text-center">
                            <p className="text-xs text-brand-gray">Actual</p>
                            <p className="text-lg font-bold text-amber-700">26%</p>
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <h3 className="text-xs font-semibold text-brand-gray">Tardiness</h3>
                        {TEAM_AGENTS.filter((a) => a.status === 'late').map((a) => (
                            <div key={a.id} className="flex items-center justify-between rounded-lg bg-amber-50 px-3 py-1.5 text-xs">
                                <span>{a.name}</span>
                                <span className="font-medium text-amber-700">{a.tardiness} min late · payroll deduction flagged</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
                {/* Pending Shift Change */}
                <Card>
                    <div className="mb-3 flex items-center gap-2">
                        <ArrowLeftRight size={16} className="text-brand-gray" />
                        <h2 className="text-sm font-semibold">Pending Shift Change Requests</h2>
                    </div>
                    {swapStatus === 'pending' ? (
                        <div className="space-y-3">
                            <div className="rounded-lg border border-surface-border p-3 text-sm">
                                <div className="flex items-center justify-between gap-2 mb-2">
                                    <p><span className="font-medium">Agent #12</span> ↔ <span className="font-medium">Agent #33</span> · Thursday</p>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                                    <div className="rounded bg-surface-muted p-2">
                                        <p className="text-brand-gray">Agent #12 from</p>
                                        <p className="font-medium">Early 07:00–15:00</p>
                                    </div>
                                    <div className="rounded bg-surface-muted p-2">
                                        <p className="text-brand-gray">Agent #33 from</p>
                                        <p className="font-medium">Mid 10:00–18:00</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-1.5 text-[11px] mb-3">
                                    <Badge variant="green">Compliance: passed</Badge>
                                    <Badge variant="green">Skills: maintained</Badge>
                                    <Badge variant="green">Agent #33: accepted</Badge>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" onClick={handleApproveSwap}>
                                        <CheckCircle2 size={13} /> Approve
                                    </Button>
                                    <Button size="sm" variant="ghost" onClick={() => { setSwapStatus('declined'); toast.info('Swap declined. Agents notified.') }}>
                                        Decline
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : swapStatus === 'approved' ? (
                        <div className="flex items-center gap-3 rounded-lg bg-status-green/10 px-4 py-3 text-sm text-status-green">
                            <CheckCircle2 size={16} className="shrink-0" />
                            <span>Swap approved. Agent #12 and Agent #33 schedules updated. WFM recalculated.</span>
                        </div>
                    ) : (
                        <AlertBanner variant="amber" message="Swap declined. Agents notified." />
                    )}
                </Card>

                {/* Bradford Factor flags */}
                <Card>
                    <div className="mb-3 flex items-center gap-2">
                        <ShieldAlert size={16} className="text-brand-gray" />
                        <h2 className="text-sm font-semibold">Bradford Factor Flags — Top 3</h2>
                    </div>
                    <div className="space-y-2">
                        {[
                            { name: 'Ryan Costa', score: 186, status: 'Red', spells: 3, days: 8, pattern: 'Mon/Fri pattern' },
                            { name: 'Priya Sharma', score: 72, status: 'Amber', spells: 2, days: 3, pattern: '' },
                            { name: 'Quinn Davis', score: 24, status: 'Green', spells: 1, days: 2, pattern: '' },
                        ].map((a) => (
                            <div key={a.name} className="flex items-center justify-between rounded-lg border border-surface-border px-3 py-2 text-sm">
                                <div>
                                    <p className="font-medium text-xs">{a.name}</p>
                                    <p className="text-[11px] text-brand-gray">{a.spells} spells × {a.days} days {a.pattern && `· ${a.pattern}`}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-bold">{a.score}</span>
                                    <Badge variant={a.status === 'Red' ? 'red' : a.status === 'Amber' ? 'amber' : 'green'}>
                                        {a.status}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                        <Link href="/attendance/bradford" className="block text-center text-xs text-brand-primary hover:underline pt-1">
                            View full Bradford Factor →
                        </Link>
                    </div>
                </Card>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
                {/* Agent Attendance Grid */}
                <Card>
                    <div className="mb-3 flex items-center gap-2">
                        <Users size={16} className="text-brand-gray" />
                        <h2 className="text-sm font-semibold">Agent Attendance — Today</h2>
                    </div>
                    <div className="space-y-1.5">
                        {TEAM_AGENTS.map((a) => {
                            const cfg = STATUS_CONFIG[a.status]
                            return (
                                <div key={a.id} className="flex items-center justify-between rounded-lg px-3 py-1.5 text-sm hover:bg-surface-muted/50">
                                    <div className="flex items-center gap-2">
                                        <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
                                        <span className="text-xs font-medium">{a.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {a.tardiness > 0 && (
                                            <span className="text-[11px] text-amber-600">{a.tardiness} min late</span>
                                        )}
                                        <Badge variant={cfg.badge}>{cfg.label}</Badge>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </Card>

                {/* FTE Loss Widget + Coaching Summary */}
                <div className="space-y-4">
                    <Card>
                        <div className="mb-3 flex items-center gap-2">
                            <BarChart2 size={16} className="text-brand-gray" />
                            <h2 className="text-sm font-semibold">FTE Loss Widget</h2>
                            <span className="ml-auto text-[10px] rounded bg-green-100 text-green-700 px-1.5 py-0.5 font-medium">NO EUR</span>
                        </div>
                        <div className="grid grid-cols-3 gap-3 text-center text-sm">
                            <div className="rounded-lg border border-surface-border p-2">
                                <p className="text-xs text-brand-gray">Nominal FTEs</p>
                                <p className="text-xl font-bold">10.0</p>
                            </div>
                            <div className="rounded-lg border border-amber-200 bg-amber-50 p-2">
                                <p className="text-xs text-brand-gray">Effective</p>
                                <p className="text-xl font-bold text-amber-700">5.9</p>
                            </div>
                            <div className="rounded-lg border border-red-200 bg-red-50 p-2">
                                <p className="text-xs text-brand-gray">Loss %</p>
                                <p className="text-xl font-bold text-status-red">41%</p>
                                <p className="text-[10px] text-status-red">↓ Worsening</p>
                            </div>
                        </div>
                        <Link href="/performance" className="mt-2 block text-center text-xs text-brand-primary hover:underline">
                            FTE loss breakdown →
                        </Link>
                    </Card>

                    <Card>
                        <div className="flex items-center gap-2 mb-2">
                            <MessagesSquare size={16} className="text-brand-gray" />
                            <h2 className="text-sm font-semibold">Coaching Tickets</h2>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex-1 rounded-lg border border-red-200 bg-red-50 p-2 text-center">
                                <p className="text-xs text-brand-gray">Open</p>
                                <p className="text-xl font-bold text-status-red">3</p>
                            </div>
                            <div className="flex-1 rounded-lg border border-amber-200 bg-amber-50 p-2 text-center">
                                <p className="text-xs text-brand-gray">Follow-up due today</p>
                                <p className="text-xl font-bold text-status-amber">1</p>
                            </div>
                        </div>
                        <Link href="/coaching" className="mt-2 block text-center text-xs text-brand-primary hover:underline">
                            Go to Coaching Kanban →
                        </Link>
                    </Card>
                </div>
            </div>

            {/* AI Premium Features */}
            <div className="grid gap-4 sm:grid-cols-3">
                <AiFeatureLock title="Behaviour Analytics" description="AI-powered analysis of agent behaviour patterns and coaching impact predictions" />
                <AiFeatureLock title="Coaching Recommendations" description="AI suggests optimal coaching approach based on KSB patterns and historical outcomes" />
                <AiFeatureLock title="Performance-Risk Alerts" description="Early warning system for agents at risk of performance decline" />
            </div>
        </div>
    )
}

// ─── Page root ────────────────────────────────────────────────────────────────
export default function HomePage() {
    const { level } = useRole()

    if (level === 1) {
        return (
            <div className="space-y-1">
                <div className="mb-4">
                    <h1 className="text-xl font-bold tracking-tight">Home</h1>
                    <p className="text-sm text-brand-gray">Agent #12 · Team A · Client A</p>
                </div>
                <L1Home />
            </div>
        )
    }

    if (level === 2) {
        return (
            <div className="space-y-1">
                <div className="mb-4">
                    <h1 className="text-xl font-bold tracking-tight">Home</h1>
                    <p className="text-sm text-brand-gray">Team Lead · Team A · 10 agents</p>
                </div>
                <L2Home />
            </div>
        )
    }

    // L3+ redirect to overview
    if (typeof window !== 'undefined') {
        window.location.replace('/overview')
    }
    return null
}
