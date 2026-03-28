'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import { StatCard } from '@/components/molecules/StatCard'
import { AlertBanner } from '@/components/molecules/AlertBanner'
import {
    AlertTriangle,
    Clock,
    RefreshCw,
    CheckCircle2,
    CalendarCheck,
    ChevronDown,
    ChevronUp,
    X,
    Zap,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────
type KSBRoot = 'Knowledge' | 'Skill' | 'Behaviour'
type CoachingCategory = 'Productivity' | 'Quality' | 'Adherence'
type CoachingType = 'One-on-One' | 'Written'
type Severity = 'Critical' | 'High' | 'Medium' | 'Low'
type KanbanStatus = 'open' | 'acknowledged' | 'in-progress' | 'follow-up' | 'resolved'

interface CoachingTicket {
    id: string
    severity: Severity
    status: KanbanStatus
    agentName: string
    agentId: string
    category: CoachingCategory
    description: string
    autoTriggered: boolean
    createdAt: string
    age: string
    rootCause?: KSBRoot
    coachingType?: CoachingType
    notes?: string
    phrases?: string[]
    followUpDate?: string
    expectedOutcome?: string
    followUpComparison?: { metric: string; atCoaching: string; now: string; target: string; assessment: 'Improved' | 'Partial Improvement' | 'No Change' | 'Worsened' }
}

// ─── Demo data: 10 auto-triggers + manual tickets ─────────────────────────────
const INITIAL_TICKETS: CoachingTicket[] = [
    {
        id: 'tc-001', severity: 'High', status: 'open', agentName: 'Agent #7', agentId: '#7',
        category: 'Productivity', description: 'AHT 6.8 min vs 5.0 target for 3+ hours (>120% for 90+ min)', autoTriggered: true,
        createdAt: '2026-03-28T07:15:00Z', age: '2h ago',
    },
    {
        id: 'tc-002', severity: 'High', status: 'acknowledged', agentName: 'Ella Brooks', agentId: 'ella',
        category: 'Quality', description: 'QA evaluation 62% — below 70% threshold (Call Handling)', autoTriggered: true,
        createdAt: '2026-03-28T06:00:00Z', age: '3h ago',
        rootCause: 'Skill', coachingType: 'One-on-One',
        notes: 'Briefed on proper call handling structure. Rushing under pressure identified.',
        phrases: [
            'Opening: "Thank you for calling Client A. My name is Ella, how can I help you today?"',
            'Confirmation: "Just to make sure I understand, you\'re experiencing [issue]. Is that right?"',
            'Hold: "I\'ll need about 2 minutes to check this. May I place you on a brief hold?"',
            'Closing: "Is there anything else I can help you with today?"',
        ],
        followUpDate: '2026-03-30', expectedOutcome: 'QA > 80% by March 30',
    },
    {
        id: 'tc-003', severity: 'High', status: 'open', agentName: 'Ryan Costa', agentId: 'ryan',
        category: 'Adherence', description: 'Late 4 times in 5 working days (>3x threshold)', autoTriggered: true,
        createdAt: '2026-03-28T07:00:00Z', age: '2h ago',
    },
    {
        id: 'tc-004', severity: 'Medium', status: 'in-progress', agentName: 'Agent #22', agentId: '#22',
        category: 'Adherence', description: '3+ break overruns in last 2 shifts — extended breaks pattern', autoTriggered: true,
        createdAt: '2026-03-27T10:00:00Z', age: '1d ago',
        rootCause: 'Behaviour', coachingType: 'Written',
        notes: 'Written warning sent. Break schedule policy re-shared. Second overrun within 7 days triggers escalation.',
        followUpDate: '2026-04-04', expectedOutcome: 'Zero break overruns in next 5 shifts',
    },
    {
        id: 'tc-005', severity: 'Medium', status: 'follow-up', agentName: 'Agent #7', agentId: '#7',
        category: 'Productivity', description: 'Follow-up #162: AHT was 6.8, now 5.3 — target 5.5', autoTriggered: true,
        createdAt: '2026-04-04T08:00:00Z', age: 'Due today',
        rootCause: 'Knowledge', coachingType: 'One-on-One',
        notes: 'Extend coaching — product knowledge e-learning module assigned.',
        followUpDate: '2026-04-11', expectedOutcome: 'AHT < 5.5 by April 11',
        followUpComparison: { metric: 'AHT', atCoaching: '6.8 min', now: '5.3 min', target: '5.5 min', assessment: 'Partial Improvement' },
    },
    {
        id: 'tc-006', severity: 'Medium', status: 'open', agentName: 'Frank Osei', agentId: 'frank',
        category: 'Productivity', description: 'Extended AUX >15 min single session — idle during active queue', autoTriggered: true,
        createdAt: '2026-03-28T09:30:00Z', age: '30m ago',
    },
    {
        id: 'tc-007', severity: 'Low', status: 'resolved', agentName: 'Agent #12', agentId: '#12',
        category: 'Adherence', description: 'Schedule adherence 83% — below 85% for full shift', autoTriggered: true,
        createdAt: '2026-03-25T08:00:00Z', age: '3d ago',
        rootCause: 'Knowledge', coachingType: 'One-on-One',
        notes: 'Agent briefed on schedule adherence importance. AUX codes explained.',
        followUpDate: '2026-03-28', expectedOutcome: 'Adherence > 85%',
    },
    {
        id: 'tc-008', severity: 'Medium', status: 'resolved', agentName: 'Grace Kim', agentId: 'grace',
        category: 'Quality', description: 'CSAT < 60% on 6 consecutive interactions', autoTriggered: true,
        createdAt: '2026-03-24T14:00:00Z', age: '4d ago',
        rootCause: 'Skill', coachingType: 'One-on-One',
        notes: 'Side-by-side coaching completed. De-escalation techniques practised.',
        followUpDate: '2026-03-31', expectedOutcome: 'CSAT > 70%',
    },
]

const AUTO_TRIGGERS = [
    { trigger: 'AHT > 120% target for 90 min', category: 'Productivity', severity: 'High' as Severity },
    { trigger: 'ACW > 150% target for 90 min', category: 'Productivity', severity: 'Medium' as Severity },
    { trigger: 'Extended AUX > 15 min single session', category: 'Productivity', severity: 'Medium' as Severity },
    { trigger: 'QA evaluation < 70%', category: 'Quality', severity: 'High' as Severity },
    { trigger: 'CSAT < 60% on 5+ interactions', category: 'Quality', severity: 'Medium' as Severity },
    { trigger: 'FCR < 65% over rolling 7 days', category: 'Quality', severity: 'Medium' as Severity },
    { trigger: 'Schedule adherence < 85% for full shift', category: 'Adherence', severity: 'Medium' as Severity },
    { trigger: 'Late 3+ times in 5 working days', category: 'Adherence', severity: 'High' as Severity },
    { trigger: '2+ break overruns in single shift', category: 'Adherence', severity: 'Medium' as Severity },
    { trigger: 'Extended idle > 5 min during active queue', category: 'Productivity', severity: 'Low' as Severity },
]

const SEVERITY_CFG: Record<Severity, { badge: 'red' | 'amber' | 'blue' | 'grey'; dot: string }> = {
    Critical: { badge: 'red', dot: 'bg-status-red' },
    High: { badge: 'amber', dot: 'bg-status-amber' },
    Medium: { badge: 'blue', dot: 'bg-blue-400' },
    Low: { badge: 'grey', dot: 'bg-zinc-400' },
}

const CATEGORY_CFG: Record<CoachingCategory, 'red' | 'amber' | 'blue'> = {
    Productivity: 'amber',
    Quality: 'blue',
    Adherence: 'red',
}

const KSB_CFG: Record<KSBRoot, string> = {
    Knowledge: 'text-blue-600 bg-blue-50 border-blue-200',
    Skill: 'text-green-700 bg-green-50 border-green-200',
    Behaviour: 'text-red-700 bg-red-50 border-red-200',
}

// ─── Ticket form ─────────────────────────────────────────────────────────────
function TicketForm({
    ticket,
    onSave,
    onCancel,
}: {
    ticket: CoachingTicket
    onSave: (updated: CoachingTicket) => void
    onCancel: () => void
}) {
    const [category, setCategory] = useState<CoachingCategory>(ticket.category)
    const [rootCause, setRootCause] = useState<KSBRoot>(ticket.rootCause ?? 'Knowledge')
    const [coachingType, setCoachingType] = useState<CoachingType>(ticket.coachingType ?? 'One-on-One')
    const [notes, setNotes] = useState(ticket.notes ?? '')
    const [phrases, setPhrases] = useState(ticket.phrases?.join('\n') ?? '')
    const [followUpDate, setFollowUpDate] = useState(ticket.followUpDate ?? '')
    const [expectedOutcome, setExpectedOutcome] = useState(ticket.expectedOutcome ?? '')

    const valid = notes.trim() && followUpDate && expectedOutcome.trim()

    const handleSave = () => {
        onSave({
            ...ticket,
            category,
            rootCause,
            coachingType,
            notes,
            phrases: phrases.split('\n').filter(Boolean),
            followUpDate,
            expectedOutcome,
            status: 'acknowledged',
        })
        toast.success('Coaching ticket saved', {
            description: `Acknowledged. Follow-up scheduled ${followUpDate}. ${rootCause === 'Knowledge' ? 'Training request auto-created for L3.' : ''}`,
        })
        if (rootCause === 'Knowledge') {
            toast.info('Training request auto-created', { description: 'Sent to Level 3 HR/Training for review.' })
        }
        if (rootCause === 'Behaviour') {
            toast.warning('Pattern alert', { description: 'Behaviour root cause recorded. 3 Behaviour tickets will auto-escalate to HR.' })
        }
    }

    return (
        <div className="space-y-4 rounded-xl border border-surface-border bg-surface-muted/30 p-4 text-sm">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold">Coaching Form — {ticket.agentName}</h3>
                <button type="button" onClick={onCancel}><X size={16} className="text-brand-gray" /></button>
            </div>

            {/* 1. Category */}
            <div>
                <label className="mb-1 block text-xs font-medium text-brand-gray">1. Category <span className="text-status-red">*</span></label>
                <div className="flex gap-2">
                    {(['Productivity', 'Quality', 'Adherence'] as CoachingCategory[]).map((c) => (
                        <button
                            key={c}
                            type="button"
                            onClick={() => setCategory(c)}
                            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${category === c ? 'bg-foreground text-white border-foreground' : 'border-surface-border text-brand-gray hover:border-foreground/40'}`}
                        >
                            {c}
                        </button>
                    ))}
                </div>
            </div>

            {/* 2. Root Cause KSB */}
            <div>
                <label className="mb-1 block text-xs font-medium text-brand-gray">2. Root Cause (KSB) <span className="text-status-red">*</span></label>
                <div className="grid grid-cols-3 gap-2">
                    {(['Knowledge', 'Skill', 'Behaviour'] as KSBRoot[]).map((k) => (
                        <button
                            key={k}
                            type="button"
                            onClick={() => setRootCause(k)}
                            className={`rounded-lg border px-2 py-2 text-xs font-medium transition-colors ${rootCause === k ? KSB_CFG[k] + ' font-semibold' : 'border-surface-border text-brand-gray hover:bg-surface-muted'}`}
                        >
                            {k}
                            <p className="mt-0.5 font-normal opacity-70 text-[10px]">
                                {k === 'Knowledge' ? "Doesn't know" : k === 'Skill' ? "Knows, can't execute" : "Knows, chooses not to"}
                            </p>
                        </button>
                    ))}
                </div>
            </div>

            {/* 3. Coaching Type */}
            <div>
                <label className="mb-1 block text-xs font-medium text-brand-gray">3. Coaching Type <span className="text-status-red">*</span></label>
                <div className="flex gap-2">
                    {(['One-on-One', 'Written'] as CoachingType[]).map((t) => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => setCoachingType(t)}
                            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${coachingType === t ? 'bg-foreground text-white border-foreground' : 'border-surface-border text-brand-gray hover:border-foreground/40'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* 4. Coaching Notes */}
            <div>
                <label className="mb-1 block text-xs font-medium text-brand-gray">4. Coaching Notes <span className="text-status-red">*</span></label>
                <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="What was discussed / sent to agent…"
                    className="w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-primary"
                />
            </div>

            {/* 5. Specific Phrases (optional) */}
            <div>
                <label className="mb-1 block text-xs font-medium text-brand-gray">5. Specific Phrases <span className="text-[10px] text-brand-gray">(optional — one per line)</span></label>
                <textarea
                    rows={4}
                    value={phrases}
                    onChange={(e) => setPhrases(e.target.value)}
                    placeholder={`Opening: "Thank you for calling [Client A]..."\nHold: "May I place you on a brief hold?"\n...`}
                    className="w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand-primary"
                />
            </div>

            {/* 6. Follow-Up Date */}
            <div>
                <label className="mb-1 block text-xs font-medium text-brand-gray">6. Follow-Up Date <span className="text-status-red">*</span> (cannot skip)</label>
                <div className="flex items-center gap-2">
                    <input
                        type="date"
                        value={followUpDate}
                        onChange={(e) => setFollowUpDate(e.target.value)}
                        className="rounded-lg border border-surface-border bg-white px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-brand-primary"
                    />
                    <div className="flex gap-1">
                        {['7d', '14d', '30d'].map((d, i) => {
                            const days = [7, 14, 30][i]
                            const dateStr = new Date(Date.now() + days * 86400000).toISOString().split('T')[0]
                            return (
                                <button key={d} type="button" onClick={() => setFollowUpDate(dateStr)}
                                    className="rounded border border-surface-border px-2 py-1 text-[10px] text-brand-gray hover:bg-surface-muted">
                                    +{d}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* 7. Expected Outcome */}
            <div>
                <label className="mb-1 block text-xs font-medium text-brand-gray">7. Expected Outcome <span className="text-status-red">*</span></label>
                <input
                    type="text"
                    value={expectedOutcome}
                    onChange={(e) => setExpectedOutcome(e.target.value)}
                    placeholder='e.g. "AHT < 5.5 min by follow-up date"'
                    className="w-full rounded-lg border border-surface-border bg-white px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-brand-primary"
                />
            </div>

            <div className="flex gap-2 pt-1">
                <Button size="sm" disabled={!valid} onClick={handleSave} className="flex-1">
                    <CheckCircle2 size={13} /> Save &amp; Send to Agent
                </Button>
                <Button size="sm" variant="ghost" onClick={onCancel}>
                    Cancel
                </Button>
            </div>
        </div>
    )
}

// ─── Follow-up Ticket Action ─────────────────────────────────────────────────
function FollowUpActions({ ticket, onAction }: { ticket: CoachingTicket; onAction: (id: string, action: string) => void }) {
    const fu = ticket.followUpComparison!
    return (
        <div className="mt-3 space-y-3 rounded-xl border border-blue-200 bg-blue-50/40 p-3 text-sm">
            <p className="font-semibold text-sm">Follow-up Ticket — Auto-Created</p>
            <div className="grid grid-cols-4 gap-2 text-xs text-center">
                <div className="rounded border border-surface-border bg-white p-2">
                    <p className="text-brand-gray">Metric</p>
                    <p className="font-medium">{fu.metric}</p>
                </div>
                <div className="rounded border border-surface-border bg-white p-2">
                    <p className="text-brand-gray">At coaching</p>
                    <p className="font-medium text-status-red">{fu.atCoaching}</p>
                </div>
                <div className="rounded border border-surface-border bg-white p-2">
                    <p className="text-brand-gray">Now</p>
                    <p className="font-medium text-status-amber">{fu.now}</p>
                </div>
                <div className="rounded border border-surface-border bg-white p-2">
                    <p className="text-brand-gray">Target</p>
                    <p className="font-medium text-status-green">{fu.target}</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-xs text-brand-gray">Assessment:</span>
                <Badge variant="amber">{fu.assessment}</Badge>
            </div>
            <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="ghost" className="border border-green-300 text-green-700" onClick={() => onAction(ticket.id, 'improved')}>
                    ✓ Improved — Close
                </Button>
                <Button size="sm" variant="ghost" className="border border-amber-300 text-amber-700" onClick={() => onAction(ticket.id, 'extend')}>
                    Extend Coaching
                </Button>
                <Button size="sm" variant="ghost" className="border border-red-300 text-red-700" onClick={() => onAction(ticket.id, 'escalate')}>
                    Escalate to L3
                </Button>
                <Button size="sm" variant="ghost" className="border border-surface-border text-brand-gray" onClick={() => onAction(ticket.id, 'reclassify')}>
                    Reclassify Root Cause
                </Button>
            </div>
        </div>
    )
}

// ─── Kanban Card ─────────────────────────────────────────────────────────────
function KanbanCard({
    ticket,
    onAcknowledge,
    onFollowUpAction,
}: {
    ticket: CoachingTicket
    onAcknowledge: (id: string) => void
    onFollowUpAction: (id: string, action: string) => void
}) {
    const [expanded, setExpanded] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const sc = SEVERITY_CFG[ticket.severity]

    return (
        <Card className="p-3 text-sm space-y-2 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full shrink-0 ${sc.dot}`} />
                    <Badge variant={sc.badge}>{ticket.severity}</Badge>
                    <Badge variant={CATEGORY_CFG[ticket.category]}>{ticket.category}</Badge>
                    {ticket.autoTriggered && <span className="rounded border border-zinc-200 px-1.5 py-0.5 text-[10px] text-zinc-500">Auto</span>}
                </div>
                <button type="button" onClick={() => setExpanded(!expanded)} className="shrink-0 text-brand-gray hover:text-foreground">
                    {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
            </div>

            <p className="font-medium text-xs">{ticket.agentName}</p>
            <p className="text-[11px] text-brand-gray leading-snug">{ticket.description}</p>
            <p className="text-[10px] text-brand-gray">{ticket.age}</p>

            {expanded && ticket.rootCause && (
                <div className="space-y-1.5 rounded-lg bg-surface-muted/50 p-2 text-xs">
                    <div className="flex items-center gap-2">
                        <span className="text-brand-gray">Root Cause:</span>
                        <span className={`rounded border px-1.5 py-0.5 text-[10px] font-medium ${KSB_CFG[ticket.rootCause]}`}>{ticket.rootCause}</span>
                        <span className="text-brand-gray">·</span>
                        <span className="font-medium">{ticket.coachingType}</span>
                    </div>
                    {ticket.notes && <p className="text-brand-gray"><span className="font-medium">Notes:</span> {ticket.notes}</p>}
                    {ticket.phrases && ticket.phrases.length > 0 && (
                        <div>
                            <p className="font-medium text-brand-gray mb-1">Phrases sent to agent:</p>
                            <ul className="space-y-0.5">
                                {ticket.phrases.map((p, i) => (
                                    <li key={i} className="rounded bg-white px-2 py-1 border border-surface-border text-[10px]">{p}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {ticket.followUpDate && (
                        <p className="text-brand-gray">
                            <span className="font-medium">Follow-up:</span> {ticket.followUpDate} · {ticket.expectedOutcome}
                        </p>
                    )}
                </div>
            )}

            {/* Follow-up ticket action */}
            {ticket.status === 'follow-up' && ticket.followUpComparison && (
                <FollowUpActions ticket={ticket} onAction={onFollowUpAction} />
            )}

            {/* Open: acknowledge / show form */}
            {ticket.status === 'open' && !showForm && (
                <Button size="sm" className="w-full" onClick={() => setShowForm(true)}>
                    Acknowledge &amp; Fill Coaching Form
                </Button>
            )}
            {ticket.status === 'open' && showForm && (
                <TicketForm
                    ticket={ticket}
                    onSave={(updated) => { onAcknowledge(updated.id); setShowForm(false) }}
                    onCancel={() => setShowForm(false)}
                />
            )}
        </Card>
    )
}

// ─── Kanban Board ─────────────────────────────────────────────────────────────
const COLUMNS: { id: KanbanStatus; label: string; icon: React.ReactNode; count_variant: 'red' | 'amber' | 'blue' | 'grey' | 'green' }[] = [
    { id: 'open', label: 'Open', icon: <AlertTriangle size={13} className="text-status-red" />, count_variant: 'red' },
    { id: 'acknowledged', label: 'Acknowledged', icon: <Clock size={13} className="text-status-amber" />, count_variant: 'amber' },
    { id: 'in-progress', label: 'In Progress', icon: <RefreshCw size={13} className="text-blue-500" />, count_variant: 'blue' },
    { id: 'follow-up', label: 'Follow-Up', icon: <CalendarCheck size={13} className="text-purple-500" />, count_variant: 'grey' },
    { id: 'resolved', label: 'Resolved', icon: <CheckCircle2 size={13} className="text-status-green" />, count_variant: 'green' },
]

const FILTER_TABS = [
    { id: 'all', label: 'All' },
    { id: 'Productivity', label: 'Productivity' },
    { id: 'Quality', label: 'Quality' },
    { id: 'Adherence', label: 'Adherence' },
    { id: '#7', label: 'Agent #7' },
    { id: '#12', label: 'Agent #12' },
    { id: '#22', label: 'Agent #22' },
]

export default function CoachingKanbanPage() {
    const [tickets, setTickets] = useState<CoachingTicket[]>(INITIAL_TICKETS)
    const [filter, setFilter] = useState('all')
    const [showTriggers, setShowTriggers] = useState(false)

    const handleAcknowledge = (id: string, updated?: CoachingTicket) => {
        setTickets((prev) =>
            prev.map((t) => (t.id === id ? (updated ?? { ...t, status: 'acknowledged' }) : t))
        )
    }

    const handleFollowUpAction = (id: string, action: string) => {
        if (action === 'improved') {
            setTickets((prev) => prev.map((t) => t.id === id ? { ...t, status: 'resolved' } : t))
            toast.success('Both tickets closed green. Agent improved. Follow-up complete.', { duration: 4000 })
        } else if (action === 'extend') {
            setTickets((prev) => prev.map((t) => t.id === id ? { ...t, status: 'in-progress', followUpDate: '2026-04-11' } : t))
            toast.info('Coaching extended. New follow-up: April 11.')
        } else if (action === 'escalate') {
            setTickets((prev) => prev.map((t) => t.id === id ? { ...t, status: 'open' } : t))
            toast.warning('Escalated to Level 3 Ops Manager. Full evidence chain sent.')
        } else if (action === 'reclassify') {
            toast.info('Root cause reclassified. Update the coaching form.')
        }
    }

    const filtered = tickets.filter((t) => {
        if (filter === 'all') return true
        if (['Productivity', 'Quality', 'Adherence'].includes(filter)) return t.category === filter
        return t.agentId === filter
    })

    const openCount = tickets.filter((t) => t.status === 'open').length
    const followUpCount = tickets.filter((t) => t.status === 'follow-up').length
    const resolvedCount = tickets.filter((t) => t.status === 'resolved').length

    return (
        <div className="space-y-5">
            <div className="mb-2">
                <h1 className="text-xl font-bold tracking-tight">Coaching — Kanban Board</h1>
                <p className="text-sm text-brand-gray">KSB model · mandatory follow-up · auto-escalation to L3 if overdue</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatCard label="Open" value={openCount} variant={openCount > 0 ? 'red' : 'default'} trendValue="24h to acknowledge" />
                <StatCard label="Follow-Up Due" value={followUpCount} variant={followUpCount > 0 ? 'amber' : 'default'} trendValue="Handle by EOD" />
                <StatCard label="Resolved" value={resolvedCount} variant="green" />
                <StatCard label="Auto-triggered today" value={3} variant="default" trendValue="AHT, QA, Adherence" />
            </div>

            {/* Escalation timeline banner */}
            <AlertBanner
                variant="amber"
                message="Escalation timeline: 24h to acknowledge → 24h to action + set follow-up → handle follow-up by EOD. Any missed deadline auto-escalates to Level 3."
            />

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
                {FILTER_TABS.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setFilter(tab.id)}
                        className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${filter === tab.id ? 'bg-foreground text-white border-foreground' : 'border-surface-border text-brand-gray hover:border-foreground/40'}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Kanban columns */}
            <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(5, minmax(0, 1fr))' }}>
                {COLUMNS.map((col) => {
                    const colTickets = filtered.filter((t) => t.status === col.id)
                    return (
                        <div key={col.id} className="space-y-3">
                            <div className="flex items-center justify-between rounded-lg border border-surface-border bg-surface-muted/50 px-3 py-2">
                                <div className="flex items-center gap-1.5 text-xs font-semibold">
                                    {col.icon}
                                    <span>{col.label}</span>
                                </div>
                                <Badge variant={col.count_variant}>{colTickets.length}</Badge>
                            </div>
                            <div className="min-h-[100px] space-y-3">
                                {colTickets.map((t) => (
                                    <KanbanCard
                                        key={t.id}
                                        ticket={t}
                                        onAcknowledge={(id) => handleAcknowledge(id)}
                                        onFollowUpAction={handleFollowUpAction}
                                    />
                                ))}
                                {colTickets.length === 0 && (
                                    <div className="rounded-lg border border-dashed border-surface-border p-4 text-center text-[11px] text-brand-gray">
                                        No tickets
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Auto-Trigger Rules */}
            <Card>
                <button
                    type="button"
                    onClick={() => setShowTriggers(!showTriggers)}
                    className="flex w-full items-center justify-between text-sm font-semibold"
                >
                    <div className="flex items-center gap-2">
                        <Zap size={15} className="text-status-amber" />
                        Auto-Trigger Rules (10 rules — system creates tickets automatically)
                    </div>
                    {showTriggers ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                {showTriggers && (
                    <div className="mt-4 overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="border-b border-surface-border text-left text-[11px] text-brand-gray">
                                    <th className="p-2 font-medium">#</th>
                                    <th className="p-2 font-medium">Trigger Condition</th>
                                    <th className="p-2 font-medium">Category</th>
                                    <th className="p-2 font-medium">Severity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {AUTO_TRIGGERS.map((row, i) => (
                                    <tr key={i} className="border-b border-surface-border last:border-0">
                                        <td className="p-2 text-brand-gray">{i + 1}</td>
                                        <td className="p-2">{row.trigger}</td>
                                        <td className="p-2"><Badge variant={CATEGORY_CFG[row.category as CoachingCategory]}>{row.category}</Badge></td>
                                        <td className="p-2"><Badge variant={SEVERITY_CFG[row.severity].badge}>{row.severity}</Badge></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            {/* Recurring Issues */}
            <Card className="border-status-red/30 bg-status-red/5">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-status-red">
                    <RefreshCw size={14} />
                    Recurring Issues — Pattern Auto-Actions
                </h3>
                <div className="space-y-2 text-xs text-brand-gray">
                    {[
                        { pattern: '3+ tickets root cause Knowledge', action: '→ Training request auto-created for L3 HR/Training' },
                        { pattern: '3+ tickets root cause Skill', action: '→ Flags for extended coaching plan, suggests side-by-side' },
                        { pattern: '3+ tickets root cause Behaviour', action: '→ Auto-escalates to HR with full evidence chain' },
                        { pattern: '3+ Adherence tickets same agent', action: '→ Flags pattern to L3 for potential disciplinary' },
                        { pattern: '3+ Quality tickets without improvement', action: '→ Suggests reassignment to different queue/programme' },
                        { pattern: 'TL coaching >80% Written', action: '→ Flags to L3: "TL may need more one-on-one coaching"' },
                    ].map((r, i) => (
                        <div key={i} className="flex items-start gap-2 rounded-lg border border-red-200 bg-white p-2">
                            <span className="font-medium text-foreground">{r.pattern}</span>
                            <span className="text-status-red">{r.action}</span>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    )
}
