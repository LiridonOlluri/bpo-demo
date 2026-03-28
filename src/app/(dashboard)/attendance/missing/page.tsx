'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { useRole } from '@/hooks/useRole'
import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import { StatCard } from '@/components/molecules/StatCard'
import { AlertBanner } from '@/components/molecules/AlertBanner'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Clock, CheckCircle2, CalendarPlus } from 'lucide-react'

// ─── L1 — Own Missing Minutes ─────────────────────────────────────────────────
const L1_HISTORY = [
    { date: '2026-03-01', lateAmount: 0, graceApplied: 0, netAdded: 0 },
    { date: '2026-03-05', lateAmount: 4, graceApplied: 4, netAdded: 0 },
    { date: '2026-03-10', lateAmount: 8, graceApplied: 5, netAdded: 3 },
    { date: '2026-03-14', lateAmount: 0, graceApplied: 0, netAdded: 0 },
    { date: '2026-03-18', lateAmount: 3, graceApplied: 3, netAdded: 0 },
    { date: '2026-03-24', lateAmount: 0, graceApplied: 0, netAdded: 0 },
    { date: '2026-03-28', lateAmount: 8, graceApplied: 5, netAdded: 3 },
]

const L1_TREND = [
    { month: 'Jan', minutes: 12 },
    { month: 'Feb', minutes: 8 },
    { month: 'Mar', minutes: 3 },
]

function L1MissingMinutes() {
    const balance: number = 3
    const otEligible = balance === 0

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <StatCard label="Missing Min Balance" value={`${balance} min`} variant={balance > 0 ? 'amber' : 'green'} trendValue={balance > 0 ? 'OT blocked' : 'OT eligible'} />
                <StatCard label="OT Eligibility" value={otEligible ? 'Eligible' : 'Blocked'} variant={otEligible ? 'green' : 'red'} />
                <StatCard label="Mode" value="Compensate" variant="default" trendValue="Clear by arriving early" />
            </div>

            {balance > 0 && (
                <AlertBanner
                    variant="amber"
                    message={`Missing minutes: ${balance} min. OT bidding blocked until cleared. Arrive ${balance} min early on your next shift to compensate.`}
                />
            )}

            {/* Accumulation History */}
            <Card padding={false}>
                <div className="border-b border-surface-border p-4">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-gray">Accumulation History</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-surface-border text-left text-xs text-brand-gray">
                                <th className="p-3 font-medium">Date</th>
                                <th className="p-3 font-medium text-right">Late Amount</th>
                                <th className="p-3 font-medium text-right">Grace Applied</th>
                                <th className="p-3 font-medium text-right">Net Added</th>
                            </tr>
                        </thead>
                        <tbody>
                            {L1_HISTORY.map((row) => (
                                <tr key={row.date} className="border-b border-surface-border last:border-0">
                                    <td className="p-3">{row.date}</td>
                                    <td className="p-3 text-right">
                                        {row.lateAmount > 0 ? <span className="text-status-amber font-medium">{row.lateAmount} min</span> : <span className="text-brand-gray">—</span>}
                                    </td>
                                    <td className="p-3 text-right text-brand-gray">{row.graceApplied > 0 ? `${row.graceApplied} min` : '—'}</td>
                                    <td className="p-3 text-right">
                                        {row.netAdded > 0 ? (
                                            <span className="font-medium text-status-red">+{row.netAdded} min</span>
                                        ) : (
                                            <span className="text-status-green">0</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Monthly Trend Chart */}
            <Card>
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-gray">Monthly Trend</h2>
                <ResponsiveContainer width="100%" height={160}>
                    <LineChart data={L1_TREND} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip formatter={(v) => [`${v} min`, 'Missing']} />
                        <Line type="monotone" dataKey="minutes" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                </ResponsiveContainer>
                <p className="mt-2 text-xs text-brand-gray">Improving trend — keep arriving on time to clear balance.</p>
            </Card>
        </div>
    )
}

// ─── L2 — Team Missing Minutes ────────────────────────────────────────────────
const TEAM_MISSING = [
    { id: '#7', name: 'Agent #7', missing: 22, otStatus: 'Blocked', note: 'Extended breaks pattern' },
    { id: '#12', name: 'Agent #12', missing: 3, otStatus: 'Blocked', note: 'Late arrival 07:08' },
    { id: '#22', name: 'Agent #22', missing: 15, otStatus: 'Blocked', note: 'Extended breaks pattern — coaching ticket' },
    { id: '#28', name: 'Agent #28', missing: 0, otStatus: 'Eligible', note: '' },
    { id: 'alice', name: 'Alice Monroe', missing: 0, otStatus: 'Eligible', note: '' },
    { id: 'ben', name: 'Ben Carter', missing: 0, otStatus: 'Eligible', note: '' },
    { id: 'clara', name: 'Clara Singh', missing: 0, otStatus: 'Eligible', note: '' },
    { id: 'daniel', name: 'Daniel Reyes', missing: 0, otStatus: 'Eligible', note: '' },
    { id: 'ella', name: 'Ella Brooks', missing: 0, otStatus: 'Eligible', note: '' },
    { id: 'ryan', name: 'Ryan Costa', missing: 0, otStatus: 'NCNS', note: 'Absent today' },
]

const COVERAGE_GAPS = [
    { day: 'Mon 31 Mar', time: '06:49–07:00', gap: '11 min gap below Erlang', agents: ['Agent #7'] },
    { day: 'Wed 2 Apr', time: '06:49–07:00', gap: '11 min gap below Erlang', agents: ['Agent #7'] },
    { day: 'Tue 1 Apr', time: '06:57–07:00', gap: '3 min gap below Erlang', agents: ['Agent #12'] },
]

function L2MissingMinutes() {
    const [planAgent, setPlanAgent] = useState<string | null>(null)
    const [planConfirmed, setPlanConfirmed] = useState<Set<string>>(new Set())

    const teamTotal = TEAM_MISSING.reduce((s, a) => s + a.missing, 0)

    const handlePlan = (agentId: string) => {
        setPlanAgent(agentId)
    }

    const handleConfirmPlan = (agentId: string, agentName: string, minutes: number) => {
        const newSet = new Set(planConfirmed)
        newSet.add(agentId)
        setPlanConfirmed(newSet)
        setPlanAgent(null)

        const days = minutes === 22 ? 'Mon 06:49 + Wed 06:49 (11 min each)'
            : minutes === 15 ? 'Mon 06:45 + Tue 06:45 (7.5 min each)'
            : `Next shift: arrive ${minutes} min early`

        toast.success(`Compensation plan set — ${agentName}`, {
            description: `Adjusted shift: ${days}. Agent notified. Balance auto-deducts on early arrival.`,
        })
    }

    return (
        <div className="space-y-5">
            {/* Team stats — NO EUR */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatCard label="Team Total (min)" value={`${teamTotal} min`} variant={teamTotal > 0 ? 'amber' : 'green'} />
                <StatCard label="Agents Blocked" value={TEAM_MISSING.filter((a) => a.otStatus === 'Blocked').length} variant="red" trendValue="OT blocked" />
                <StatCard label="OT Eligible" value={TEAM_MISSING.filter((a) => a.otStatus === 'Eligible').length} variant="green" />
                <div className="rounded-xl border border-surface-border bg-white p-4 flex flex-col justify-center">
                    <p className="text-xs text-brand-gray mb-0.5">EUR Cost</p>
                    <p className="text-lg font-bold line-through text-brand-gray/50">—</p>
                    <p className="text-[10px] text-brand-gray">Not visible at Level 2</p>
                </div>
            </div>

            {/* Per-agent table */}
            <Card padding={false}>
                <div className="flex items-center justify-between border-b border-surface-border p-4">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-gray">Per-Agent Missing Minutes</h2>
                    <span className="text-[10px] rounded border border-green-200 bg-green-50 px-2 py-0.5 text-green-700 font-medium">Minutes only · NO EUR</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-surface-border text-left text-xs text-brand-gray">
                                <th className="p-3 font-medium">Agent</th>
                                <th className="p-3 font-medium text-right">Missing Min</th>
                                <th className="p-3 font-medium text-center">OT Status</th>
                                <th className="p-3 font-medium">Note</th>
                                <th className="p-3 font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {TEAM_MISSING.map((a) => (
                                <tr key={a.id} className="border-b border-surface-border last:border-0">
                                    <td className="p-3 font-medium">{a.name}</td>
                                    <td className="p-3 text-right">
                                        {a.missing > 0
                                            ? <span className={`font-semibold ${a.missing > 15 ? 'text-status-red' : 'text-status-amber'}`}>{a.missing} min</span>
                                            : <span className="text-status-green">0</span>
                                        }
                                    </td>
                                    <td className="p-3 text-center">
                                        <Badge variant={a.otStatus === 'Eligible' ? 'green' : a.otStatus === 'NCNS' ? 'grey' : 'red'}>
                                            {a.otStatus}
                                        </Badge>
                                    </td>
                                    <td className="p-3 text-xs text-brand-gray">{a.note || '—'}</td>
                                    <td className="p-3">
                                        {a.missing > 0 && a.otStatus === 'Blocked' ? (
                                            planConfirmed.has(a.id) ? (
                                                <Badge variant="green"><CheckCircle2 size={10} className="inline mr-1" />Plan set</Badge>
                                            ) : planAgent === a.id ? (
                                                <div className="space-y-2">
                                                    <p className="text-xs text-brand-gray font-medium">Compensation intervals (below Erlang):</p>
                                                    {COVERAGE_GAPS.filter((g) => g.agents.includes(a.name)).map((gap, i) => (
                                                        <div key={i} className="rounded border border-surface-border bg-surface-muted p-2 text-xs">
                                                            <p className="font-medium">{gap.day} · {gap.time}</p>
                                                            <p className="text-brand-gray">{gap.gap}</p>
                                                        </div>
                                                    ))}
                                                    {COVERAGE_GAPS.filter((g) => g.agents.includes(a.name)).length === 0 && (
                                                        <p className="text-xs text-brand-gray">Assign: arrive {a.missing} min early on next shift</p>
                                                    )}
                                                    <div className="flex gap-2">
                                                        <Button size="sm" onClick={() => handleConfirmPlan(a.id, a.name, a.missing)}>
                                                            <CalendarPlus size={12} /> Confirm Plan
                                                        </Button>
                                                        <Button size="sm" variant="ghost" onClick={() => setPlanAgent(null)}>Cancel</Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <Button size="sm" variant="ghost" className="border border-surface-border" onClick={() => handlePlan(a.id)}>
                                                    Plan Compensation
                                                </Button>
                                            )
                                        ) : <span className="text-xs text-brand-gray">—</span>}
                                    </td>
                                </tr>
                            ))}
                            {/* Team Total Row */}
                            <tr className="border-t-2 border-surface-border bg-surface-muted/30 font-semibold">
                                <td className="p-3">Team Total</td>
                                <td className="p-3 text-right text-status-amber">{teamTotal} min</td>
                                <td className="p-3" />
                                <td className="p-3 text-xs text-brand-gray italic">No EUR shown</td>
                                <td className="p-3" />
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* UC-2E demo data table */}
            <Card className="border-blue-200 bg-blue-50/40">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                    <Clock size={15} className="text-blue-600" />
                    UC-2E — Compensation Planning Demo
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="border-b border-surface-border text-left text-[11px] text-brand-gray">
                                <th className="p-2 font-medium">Agent</th>
                                <th className="p-2 font-medium text-right">Missing Min</th>
                                <th className="p-2 font-medium">OT Status</th>
                                <th className="p-2 font-medium">Compensation Plan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { agent: 'Agent #7', missing: 22, status: 'Blocked', plan: 'Mon arrive 11 min early (06:49) + Wed arrive 11 min early (06:49)' },
                                { agent: 'Agent #12', missing: 3, status: 'Blocked', plan: 'Next shift: arrive 3 min early (06:57)' },
                                { agent: 'Agent #22', missing: 15, status: 'Blocked', plan: 'Extended breaks pattern → coaching ticket (Adherence/Behaviour)' },
                                { agent: 'Team Total', missing: 40, status: '', plan: '(no EUR shown)' },
                            ].map((r) => (
                                <tr key={r.agent} className="border-b border-surface-border last:border-0">
                                    <td className="p-2 font-medium">{r.agent}</td>
                                    <td className={`p-2 text-right font-medium ${r.missing > 10 ? 'text-status-red' : r.missing > 0 ? 'text-status-amber' : 'text-brand-gray'}`}>
                                        {r.missing > 0 ? `${r.missing} min` : '—'}
                                    </td>
                                    <td className="p-2">
                                        {r.status && <Badge variant={r.status === 'Blocked' ? 'red' : 'green'}>{r.status}</Badge>}
                                    </td>
                                    <td className="p-2 text-brand-gray">{r.plan}</td>
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
export default function MissingMinutesPage() {
    const { level } = useRole()

    return (
        <div className="space-y-1">
            <div className="mb-4">
                <h1 className="text-xl font-bold tracking-tight">Missing Minutes</h1>
                <p className="text-sm text-brand-gray">
                    {level === 1
                        ? 'Own balance · accumulation history · compensation status'
                        : 'Per-agent balance · team total · compensation planning'
                    }
                </p>
            </div>
            {level === 1 ? <L1MissingMinutes /> : <L2MissingMinutes />}
        </div>
    )
}
