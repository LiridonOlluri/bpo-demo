'use client'

import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import { StatCard } from '@/components/molecules/StatCard'
import { TrendingDown, TrendingUp, Minus } from 'lucide-react'

const PER_AGENT_DATA = [
    { name: 'Agent #7', total: 8, open: 1, resolved: 6, recurring: 1, avgResolution: '2.3 days', k: 3, s: 2, b: 3, trend: 'down' as const },
    { name: 'Agent #12', total: 3, open: 0, resolved: 3, recurring: 0, avgResolution: '1.1 days', k: 2, s: 1, b: 0, trend: 'up' as const },
    { name: 'Agent #22', total: 5, open: 1, resolved: 3, recurring: 1, avgResolution: '1.8 days', k: 1, s: 2, b: 2, trend: 'down' as const },
    { name: 'Ryan Costa', total: 4, open: 2, resolved: 2, recurring: 0, avgResolution: '3.2 days', k: 0, s: 1, b: 3, trend: 'down' as const },
    { name: 'Ella Brooks', total: 2, open: 1, resolved: 1, recurring: 0, avgResolution: '0.5 days', k: 0, s: 2, b: 0, trend: 'stable' as const },
    { name: 'Frank Osei', total: 2, open: 1, resolved: 1, recurring: 0, avgResolution: '1.0 days', k: 1, s: 0, b: 1, trend: 'stable' as const },
    { name: 'Grace Kim', total: 3, open: 0, resolved: 3, recurring: 0, avgResolution: '1.4 days', k: 0, s: 3, b: 0, trend: 'up' as const },
    { name: 'Alice Monroe', total: 1, open: 0, resolved: 1, recurring: 0, avgResolution: '0.3 days', k: 1, s: 0, b: 0, trend: 'up' as const },
    { name: 'Daniel Reyes', total: 1, open: 0, resolved: 1, recurring: 0, avgResolution: '0.5 days', k: 0, s: 1, b: 0, trend: 'stable' as const },
    { name: 'Hasan Ali', total: 0, open: 0, resolved: 0, recurring: 0, avgResolution: '—', k: 0, s: 0, b: 0, trend: 'stable' as const },
]

const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'stable' }) =>
    trend === 'up' ? <TrendingUp size={14} className="text-status-green" />
    : trend === 'down' ? <TrendingDown size={14} className="text-status-red" />
    : <Minus size={14} className="text-brand-gray" />

const totalTickets = PER_AGENT_DATA.reduce((s, a) => s + a.total, 0)
const totalResolved = PER_AGENT_DATA.reduce((s, a) => s + a.resolved, 0)
const totalRecurring = PER_AGENT_DATA.reduce((s, a) => s + a.recurring, 0)
const totalOpen = PER_AGENT_DATA.reduce((s, a) => s + a.open, 0)

const totalK = PER_AGENT_DATA.reduce((s, a) => s + a.k, 0)
const totalS = PER_AGENT_DATA.reduce((s, a) => s + a.s, 0)
const totalB = PER_AGENT_DATA.reduce((s, a) => s + a.b, 0)
const totalKSB = totalK + totalS + totalB

export default function CoachingDashboardPage() {
    return (
        <div className="space-y-6">
            <div className="mb-2">
                <h1 className="text-xl font-bold tracking-tight">Coaching Dashboard</h1>
                <p className="text-sm text-brand-gray">Per-agent summary · KSB breakdown · effectiveness metrics</p>
            </div>

            {/* Top stats */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatCard label="Total Tickets" value={totalTickets} variant="default" />
                <StatCard label="Open" value={totalOpen} variant={totalOpen > 0 ? 'amber' : 'default'} />
                <StatCard label="Resolved" value={totalResolved} variant="green" trendValue={`${Math.round(totalResolved / totalTickets * 100)}% resolution rate`} />
                <StatCard label="Recurring" value={totalRecurring} variant={totalRecurring > 0 ? 'red' : 'default'} />
            </div>

            {/* Per-Agent Coaching Summary */}
            <Card padding={false}>
                <div className="border-b border-surface-border p-4">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-gray">Per-Agent Coaching Summary</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-surface-border text-left text-xs text-brand-gray">
                                <th className="p-3 font-medium">Agent</th>
                                <th className="p-3 font-medium text-right">Total</th>
                                <th className="p-3 font-medium text-right">Open</th>
                                <th className="p-3 font-medium text-right">Resolved</th>
                                <th className="p-3 font-medium text-right">Recurring</th>
                                <th className="p-3 font-medium text-right">Avg Resolution</th>
                                <th className="p-3 font-medium text-center">KSB Breakdown</th>
                                <th className="p-3 font-medium text-center">Trend</th>
                            </tr>
                        </thead>
                        <tbody>
                            {PER_AGENT_DATA.map((a) => (
                                <tr key={a.name} className="border-b border-surface-border last:border-0 hover:bg-surface-muted/50">
                                    <td className="p-3 font-medium">{a.name}</td>
                                    <td className="p-3 text-right">{a.total}</td>
                                    <td className="p-3 text-right">
                                        {a.open > 0 ? <span className="font-semibold text-status-amber">{a.open}</span> : <span className="text-brand-gray">0</span>}
                                    </td>
                                    <td className="p-3 text-right">
                                        <span className={a.resolved > 0 ? 'font-medium text-status-green' : 'text-brand-gray'}>{a.resolved}</span>
                                    </td>
                                    <td className="p-3 text-right">
                                        {a.recurring > 0 ? <Badge variant="red">{a.recurring}</Badge> : <span className="text-brand-gray">0</span>}
                                    </td>
                                    <td className="p-3 text-right text-brand-gray">{a.avgResolution}</td>
                                    <td className="p-3 text-center">
                                        {a.total > 0 ? (
                                            <span className="text-xs">
                                                <span className="text-blue-600 font-medium">K:{a.k}</span>
                                                <span className="mx-1 text-brand-gray">/</span>
                                                <span className="text-green-700 font-medium">S:{a.s}</span>
                                                <span className="mx-1 text-brand-gray">/</span>
                                                <span className="text-red-700 font-medium">B:{a.b}</span>
                                            </span>
                                        ) : <span className="text-brand-gray text-xs">—</span>}
                                    </td>
                                    <td className="p-3">
                                        <div className="flex items-center justify-center gap-1">
                                            <TrendIcon trend={a.trend} />
                                            <span className="text-xs text-brand-gray">
                                                {a.trend === 'up' ? 'Improving' : a.trend === 'down' ? 'Worsening' : 'Stable'}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Coaching Effectiveness Metrics */}
            <div className="grid gap-5 lg:grid-cols-2">
                <Card>
                    <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-gray">Coaching Effectiveness</h2>
                    <ul className="space-y-3 text-sm">
                        {[
                            { label: 'Total tickets this month', value: `${totalTickets}` },
                            { label: 'Resolved within 48h', value: '68%', variant: 'green' as const },
                            { label: 'Recurring tickets', value: `${totalRecurring}`, variant: totalRecurring > 0 ? 'red' as const : 'green' as const },
                            { label: 'Post-coaching improvement rate', value: '74%', variant: 'green' as const },
                            { label: 'Follow-ups completed on time', value: '9 / 11', variant: 'green' as const },
                            { label: 'Follow-ups overdue', value: '2', variant: 'amber' as const },
                            { label: 'Escalated to Level 3', value: '1', variant: 'amber' as const },
                        ].map((row) => (
                            <li key={row.label} className="flex items-center justify-between gap-2">
                                <span className="text-brand-gray">{row.label}</span>
                                {row.variant ? (
                                    <Badge variant={row.variant}>{row.value}</Badge>
                                ) : (
                                    <span className="font-medium">{row.value}</span>
                                )}
                            </li>
                        ))}
                    </ul>
                </Card>

                <Card>
                    <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-gray">KSB Split &amp; Coaching Type</h2>
                    <div className="space-y-4">
                        <div>
                            <p className="mb-2 text-xs text-brand-gray">Root Cause Distribution</p>
                            <div className="space-y-2">
                                {[
                                    { label: 'Knowledge', value: totalK, color: 'bg-blue-400', textColor: 'text-blue-600' },
                                    { label: 'Skill', value: totalS, color: 'bg-green-500', textColor: 'text-green-700' },
                                    { label: 'Behaviour', value: totalB, color: 'bg-red-400', textColor: 'text-red-700' },
                                ].map((r) => (
                                    <div key={r.label}>
                                        <div className="mb-1 flex items-center justify-between text-xs">
                                            <span className={`font-medium ${r.textColor}`}>{r.label}</span>
                                            <span className="text-brand-gray">{r.value} tickets ({totalKSB > 0 ? Math.round(r.value / totalKSB * 100) : 0}%)</span>
                                        </div>
                                        <div className="h-3 rounded-full bg-surface-muted overflow-hidden">
                                            <div className={`h-full rounded-full ${r.color}`} style={{ width: `${totalKSB > 0 ? r.value / totalKSB * 100 : 0}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className="mb-2 text-xs text-brand-gray">Coaching Type Split</p>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-lg border border-surface-border p-3 text-center">
                                    <p className="text-xs text-brand-gray">One-on-One</p>
                                    <p className="text-2xl font-bold">62%</p>
                                </div>
                                <div className="rounded-lg border border-surface-border p-3 text-center">
                                    <p className="text-xs text-brand-gray">Written</p>
                                    <p className="text-2xl font-bold">38%</p>
                                    <p className="text-[10px] text-brand-gray mt-0.5">Below 80% threshold ✓</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
