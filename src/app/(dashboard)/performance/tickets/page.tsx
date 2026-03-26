'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardTemplate } from '@/components/templates/DashboardTemplate'
import { StatCard } from '@/components/molecules/StatCard'
import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import { TabGroup } from '@/components/molecules/TabGroup'
import { Clock, AlertTriangle, RefreshCw, CheckCircle2, ChevronRight } from 'lucide-react'

type TicketStatus = 'open' | 'acknowledged' | 'in-progress' | 'resolved' | 'recurring'
type Priority = 'critical' | 'high' | 'medium' | 'low'

interface Ticket {
    id: string
    priority: Priority
    status: TicketStatus
    trigger: string
    team: string
    teamLead: string
    createdAt: string
    acknowledgedAt?: string
    resolvedAt?: string
    action?: string
    followUpDue?: string
    recurringCount?: number
}

const INITIAL_TICKETS: Ticket[] = [
    {
        id: 'tkt-001',
        priority: 'critical',
        status: 'open',
        trigger: 'Team B FTE Loss 59.5% — AHT overrun 2.7 FTE, adherence gaps 1.1 FTE',
        team: 'Team B',
        teamLead: 'Marcus Jones',
        createdAt: '2026-03-25T08:12:00Z',
        followUpDue: '2026-03-26T08:12:00Z',
    },
    {
        id: 'tkt-002',
        priority: 'high',
        status: 'acknowledged',
        trigger: 'Team D tardiness spike — 6 agents late >15 min consecutively',
        team: 'Team D',
        teamLead: 'James Wilson',
        createdAt: '2026-03-24T14:30:00Z',
        acknowledgedAt: '2026-03-24T14:52:00Z',
        action: 'Verbal coaching given to 6 agents. Monitoring.',
        followUpDue: '2026-03-25T14:30:00Z',
    },
    {
        id: 'tkt-003',
        priority: 'high',
        status: 'in-progress',
        trigger: 'Team F schedule adherence 79% — below 85% target for 3 days',
        team: 'Team F',
        teamLead: 'Elena Rossi',
        createdAt: '2026-03-24T10:00:00Z',
        acknowledgedAt: '2026-03-24T10:18:00Z',
        action: 'Coaching session scheduled. AUX codes reviewed with agents.',
        followUpDue: '2026-03-25T10:00:00Z',
    },
    {
        id: 'tkt-004',
        priority: 'medium',
        status: 'resolved',
        trigger: 'Team A AHT exceeded 5:30 for 3 consecutive intervals',
        team: 'Team A',
        teamLead: 'Sarah Chen',
        createdAt: '2026-03-22T09:45:00Z',
        acknowledgedAt: '2026-03-22T10:00:00Z',
        action: 'Briefed agents on call handling techniques. AHT normalised.',
        resolvedAt: '2026-03-23T09:00:00Z',
    },
    {
        id: 'tkt-005',
        priority: 'low',
        status: 'resolved',
        trigger: 'Team C break adherence below 90% threshold',
        team: 'Team C',
        teamLead: 'Priya Patel',
        createdAt: '2026-03-21T11:20:00Z',
        acknowledgedAt: '2026-03-21T11:35:00Z',
        action: 'Re-briefed break schedule. No recurrence.',
        resolvedAt: '2026-03-22T11:00:00Z',
    },
    {
        id: 'tkt-006',
        priority: 'high',
        status: 'recurring',
        trigger: 'Team B schedule adherence <80% — 3rd occurrence in 14 days',
        team: 'Team B',
        teamLead: 'Marcus Jones',
        createdAt: '2026-03-25T06:00:00Z',
        recurringCount: 3,
        action: 'Previous coaching: verbal warning given (×2). Escalated to Ops Manager.',
    },
]

const PRIORITY_CONFIG: Record<Priority, { label: string; badge: 'red' | 'amber' | 'blue' | 'grey'; dot: string }> = {
    critical: { label: 'Critical', badge: 'red', dot: 'bg-status-red' },
    high: { label: 'High', badge: 'amber', dot: 'bg-status-amber' },
    medium: { label: 'Medium', badge: 'blue', dot: 'bg-blue-400' },
    low: { label: 'Low', badge: 'grey', dot: 'bg-zinc-400' },
}

const COLUMNS: { id: TicketStatus; label: string; icon: React.ReactNode }[] = [
    { id: 'open', label: 'Open', icon: <AlertTriangle size={14} className="text-status-red" /> },
    { id: 'acknowledged', label: 'Acknowledged', icon: <Clock size={14} className="text-status-amber" /> },
    { id: 'in-progress', label: 'In Progress', icon: <RefreshCw size={14} className="text-blue-500" /> },
    { id: 'resolved', label: 'Resolved', icon: <CheckCircle2 size={14} className="text-status-green" /> },
]

const FILTER_TABS = [
    { id: 'all', label: 'All tickets' },
    { id: 'team-b', label: 'Team B' },
    { id: 'productivity', label: 'Productivity' },
    { id: 'quality', label: 'Quality' },
]

function formatRelative(iso: string) {
    const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000)
    if (diff < 60) return `${diff}m ago`
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`
    return `${Math.floor(diff / 1440)}d ago`
}

function TicketKanbanCard({ ticket, onMove, onView }: { ticket: Ticket; onMove: (id: string, to: TicketStatus) => void; onView: (id: string) => void }) {
    const [action, setAction] = useState(ticket.action ?? '')
    const [showAction, setShowAction] = useState(false)
    const pc = PRIORITY_CONFIG[ticket.priority]

    return (
        <Card className="space-y-2 p-3 text-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full shrink-0 ${pc.dot}`} />
                    <Badge variant={pc.badge}>{pc.label}</Badge>
                    {ticket.recurringCount && (
                        <Badge variant="red">Recurring ×{ticket.recurringCount}</Badge>
                    )}
                </div>
                <button onClick={() => onView(ticket.id)} className="text-brand-gray hover:text-foreground">
                    <ChevronRight size={14} />
                </button>
            </div>
            <p className="text-xs leading-snug">{ticket.trigger}</p>
            <div className="flex items-center justify-between text-[11px] text-brand-gray">
                <span>{ticket.team} · {ticket.teamLead}</span>
                <span>{formatRelative(ticket.createdAt)}</span>
            </div>
            {ticket.action && (
                <p className="rounded bg-surface-muted px-2 py-1 text-[11px] text-brand-gray">
                    Action: {ticket.action}
                </p>
            )}
            {ticket.status === 'open' && (
                <div className="space-y-1.5 pt-1">
                    {!showAction ? (
                        <Button size="sm" className="w-full" onClick={() => setShowAction(true)}>
                            Acknowledge ticket
                        </Button>
                    ) : (
                        <>
                            <textarea
                                className="w-full rounded border border-surface-border bg-surface-muted px-2 py-1 text-xs focus:outline-none"
                                rows={2}
                                placeholder="Coaching action taken…"
                                value={action}
                                onChange={(e) => setAction(e.target.value)}
                            />
                            <Button
                                size="sm"
                                className="w-full"
                                disabled={!action.trim()}
                                onClick={() => onMove(ticket.id, 'acknowledged')}
                            >
                                Mark acknowledged
                            </Button>
                        </>
                    )}
                </div>
            )}
            {ticket.status === 'acknowledged' && (
                <Button size="sm" className="w-full" onClick={() => onMove(ticket.id, 'in-progress')}>
                    Move to In Progress
                </Button>
            )}
            {ticket.status === 'in-progress' && (
                <Button size="sm" className="w-full" onClick={() => onMove(ticket.id, 'resolved')}>
                    Mark Resolved
                </Button>
            )}
        </Card>
    )
}

export default function TicketsPage() {
    const router = useRouter()
    const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS)
    const [filter, setFilter] = useState('all')

    const move = (id: string, to: TicketStatus) => {
        setTickets((prev) =>
            prev.map((t) =>
                t.id === id
                    ? {
                          ...t,
                          status: to,
                          acknowledgedAt: to === 'acknowledged' ? new Date().toISOString() : t.acknowledgedAt,
                          resolvedAt: to === 'resolved' ? new Date().toISOString() : t.resolvedAt,
                      }
                    : t
            )
        )
    }

    const filtered = tickets.filter((t) => {
        if (filter === 'team-b') return t.team === 'Team B'
        return true
    })

    const open = filtered.filter((t) => t.status === 'open').length
    const ack = filtered.filter((t) => t.status === 'acknowledged').length
    const inProg = filtered.filter((t) => t.status === 'in-progress').length
    const resolved = filtered.filter((t) => t.status === 'resolved').length
    const recurring = filtered.filter((t) => t.status === 'recurring').length

    return (
        <DashboardTemplate
            title="Coaching Kanban"
            statCards={
                <>
                    <StatCard label="Open" value={open} variant={open > 0 ? 'red' : 'default'} />
                    <StatCard label="Acknowledged" value={ack} variant={ack > 0 ? 'amber' : 'default'} />
                    <StatCard label="In Progress" value={inProg} variant="default" />
                    <StatCard label="Resolved" value={resolved} variant="green" />
                    <StatCard label="Recurring" value={recurring} variant={recurring > 0 ? 'red' : 'default'} />
                </>
            }
        >
            <div className="flex flex-wrap items-center gap-3">
                <TabGroup tabs={FILTER_TABS} activeTab={filter} onChange={setFilter} />
                <span className="text-xs text-brand-gray">30-min auto-escalation if TL doesn&apos;t acknowledge</span>
            </div>

            {/* Kanban columns */}
            <div className="mt-4 grid gap-4 lg:grid-cols-4">
                {COLUMNS.map((col) => {
                    const colTickets = filtered.filter((t) => t.status === col.id)
                    return (
                        <div key={col.id} className="space-y-3">
                            <div className="flex items-center justify-between rounded-lg border border-surface-border bg-surface-muted/50 px-3 py-2">
                                <div className="flex items-center gap-2 text-sm font-semibold">
                                    {col.icon}
                                    {col.label}
                                </div>
                                <Badge variant={col.id === 'open' ? 'red' : col.id === 'resolved' ? 'green' : 'grey'}>
                                    {colTickets.length}
                                </Badge>
                            </div>
                            <div className="space-y-3 min-h-[120px]">
                                {colTickets.map((t) => (
                                    <TicketKanbanCard
                                        key={t.id}
                                        ticket={t}
                                        onMove={move}
                                        onView={(id) => router.push(`/performance/${id}`)}
                                    />
                                ))}
                                {colTickets.length === 0 && (
                                    <div className="rounded-lg border border-dashed border-surface-border p-4 text-center text-xs text-brand-gray">
                                        No tickets
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Recurring tickets sidebar */}
            {filtered.filter((t) => t.status === 'recurring').length > 0 && (
                <Card className="border-status-red/30 bg-status-red/5">
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-status-red">
                        <RefreshCw size={14} />
                        Recurring Issues — Escalation Required
                    </h3>
                    {filtered.filter((t) => t.status === 'recurring').map((t) => (
                        <div key={t.id} className="rounded-lg border border-status-red/20 bg-white p-3 text-sm">
                            <div className="flex items-start justify-between gap-2">
                                <p className="text-xs">{t.trigger}</p>
                                <Badge variant="red">×{t.recurringCount}</Badge>
                            </div>
                            <p className="mt-1 text-[11px] text-brand-gray">{t.team} · {t.teamLead}</p>
                            {t.action && <p className="mt-1 rounded bg-red-50 px-2 py-1 text-[11px] text-status-red">{t.action}</p>}
                            <Button size="sm" className="mt-2 w-full" onClick={() => router.push(`/performance/${t.id}`)}>
                                View full detail
                            </Button>
                        </div>
                    ))}
                </Card>
            )}
        </DashboardTemplate>
    )
}
