'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import { StatCard } from '@/components/molecules/StatCard'
import {
    ChevronDown, ChevronUp, AlertCircle,
    Clock, Ticket, ShieldCheck, Info,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────
interface AdherenceViolation {
    date: string
    shift: string
    type: 'Tardiness' | 'Early departure' | 'Extended break' | 'AUX overrun' | 'Schedule gap'
    duration: number    // minutes
    pattern: string[]
    notes: string
}

interface AdhBradfordAgent {
    id: string
    name: string
    spells: number      // S — number of separate violation instances
    days: number        // D — number of days with at least one violation
    score: number       // S² × D
    threshold: 'green' | 'amber' | 'ticket' | 'escalation' | 'investigation'
    patterns: string[]
    topViolationType: string
    history: AdherenceViolation[]
}

// ─── Demo data (UC-2B-ADH: Agent #22 score 162) ───────────────────────────────
// Agent #22: 9 violation spells × 2 days = 9² × 2 = 81 × 2 = 162 ✓
const AGENTS: AdhBradfordAgent[] = [
    {
        id: '#22', name: 'Agent #22', spells: 9, days: 2, score: 162,
        threshold: 'ticket',
        patterns: ['Early shift lateness (07:00)', 'Extended breaks — peak hours'],
        topViolationType: 'Tardiness',
        history: [
            { date: '2026-03-28 Fri', shift: 'Early 07:00–15:00', type: 'Tardiness', duration: 9, pattern: ['Early shift'], notes: 'Arrived 07:09, grace 5min, net 4min' },
            { date: '2026-03-27 Thu', shift: 'Early 07:00–15:00', type: 'Extended break', duration: 12, pattern: ['Peak hour', 'Extended break'], notes: 'Break at 10:00–10:22 (allocated 15min)' },
            { date: '2026-03-26 Wed', shift: 'Early 07:00–15:00', type: 'Tardiness', duration: 7, pattern: ['Early shift'], notes: 'Arrived 07:07' },
            { date: '2026-03-25 Tue', shift: 'Early 07:00–15:00', type: 'Tardiness', duration: 6, pattern: ['Early shift'], notes: 'Arrived 07:06' },
            { date: '2026-03-24 Mon', shift: 'Early 07:00–15:00', type: 'Tardiness', duration: 11, pattern: ['Early shift', 'Monday'], notes: 'Arrived 07:11, coaching note raised' },
            { date: '2026-03-24 Mon', shift: 'Early 07:00–15:00', type: 'Extended break', duration: 8, pattern: ['Peak hour'], notes: 'Lunch break 12:45–13:23 (allocated 30min)' },
            { date: '2026-03-21 Fri', shift: 'Early 07:00–15:00', type: 'Tardiness', duration: 8, pattern: ['Early shift', 'Friday'], notes: '' },
            { date: '2026-03-21 Fri', shift: 'Early 07:00–15:00', type: 'AUX overrun', duration: 14, pattern: ['End of day'], notes: 'Personal AUX 14:46–15:00, not available for last interval' },
            { date: '2026-03-18 Tue', shift: 'Early 07:00–15:00', type: 'Tardiness', duration: 5, pattern: ['Early shift'], notes: '' },
        ],
    },
    {
        id: 'ryan', name: 'Ryan Costa', spells: 4, days: 3, score: 48,
        threshold: 'green',
        patterns: ['Monday tardiness'],
        topViolationType: 'Tardiness',
        history: [
            { date: '2026-03-23 Mon', shift: 'Early 07:00–15:00', type: 'Tardiness', duration: 8,  pattern: ['Monday'], notes: '' },
            { date: '2026-03-16 Mon', shift: 'Early 07:00–15:00', type: 'Tardiness', duration: 6,  pattern: ['Monday'], notes: '' },
            { date: '2026-03-09 Mon', shift: 'Early 07:00–15:00', type: 'Tardiness', duration: 12, pattern: ['Monday'], notes: '' },
            { date: '2026-03-04 Wed', shift: 'Early 07:00–15:00', type: 'Extended break', duration: 7, pattern: [], notes: '' },
        ],
    },
    {
        id: '#7', name: 'Agent #7', spells: 3, days: 2, score: 18,
        threshold: 'green',
        patterns: [],
        topViolationType: 'AUX overrun',
        history: [
            { date: '2026-03-25 Tue', shift: 'Mid 10:00–18:00', type: 'AUX overrun', duration: 9,  pattern: [], notes: '' },
            { date: '2026-03-18 Tue', shift: 'Mid 10:00–18:00', type: 'AUX overrun', duration: 11, pattern: [], notes: '' },
            { date: '2026-03-18 Tue', shift: 'Mid 10:00–18:00', type: 'Extended break', duration: 6, pattern: [], notes: '' },
        ],
    },
    {
        id: 'priya', name: 'Priya Sharma', spells: 2, days: 2, score: 8,
        threshold: 'green',
        patterns: [],
        topViolationType: 'Tardiness',
        history: [
            { date: '2026-03-20 Fri', shift: 'Early 07:00–15:00', type: 'Tardiness', duration: 5, pattern: [], notes: '' },
            { date: '2026-03-13 Fri', shift: 'Early 07:00–15:00', type: 'Tardiness', duration: 4, pattern: [], notes: '' },
        ],
    },
    {
        id: '#12', name: 'Agent #12', spells: 1, days: 1, score: 1,
        threshold: 'green',
        patterns: [],
        topViolationType: 'Tardiness',
        history: [
            { date: '2026-03-28 Fri', shift: 'Early 07:00–15:00', type: 'Tardiness', duration: 3, pattern: [], notes: '' },
        ],
    },
    {
        id: 'ella', name: 'Ella Brooks', spells: 0, days: 0, score: 0, threshold: 'green', patterns: [], topViolationType: '—', history: [] },
    { id: 'alice', name: 'Alice Monroe', spells: 0, days: 0, score: 0, threshold: 'green', patterns: [], topViolationType: '—', history: [] },
    { id: 'frank', name: 'Frank Osei',   spells: 1, days: 1, score: 1, threshold: 'green', patterns: [], topViolationType: 'Extended break',
        history: [{ date: '2026-03-17 Tue', shift: 'Mid 10:00–18:00', type: 'Extended break', duration: 5, pattern: [], notes: '' }],
    },
    { id: 'grace', name: 'Grace Kim',    spells: 0, days: 0, score: 0, threshold: 'green', patterns: [], topViolationType: '—', history: [] },
    { id: '#33',   name: 'Agent #33',    spells: 1, days: 1, score: 1, threshold: 'green', patterns: [], topViolationType: 'Tardiness',
        history: [{ date: '2026-03-19 Thu', shift: 'Mid 10:00–18:00', type: 'Tardiness', duration: 4, pattern: [], notes: '' }],
    },
]

// ─── Threshold config (same scale, independent from Sick Bradford) ────────────
type Threshold = AdhBradfordAgent['threshold']

const THRESHOLD_CONFIG: Record<Threshold, { label: string; badge: 'green' | 'amber' | 'red' | 'grey'; range: string; action: string }> = {
    green:         { label: 'Green',         badge: 'green', range: '0–50',    action: 'Monitor only' },
    amber:         { label: 'Amber',         badge: 'amber', range: '51–124',  action: 'Informal discussion' },
    ticket:        { label: 'Red — Ticket',  badge: 'red',   range: '125–399', action: 'Coaching ticket created' },
    escalation:    { label: 'Escalation',    badge: 'red',   range: '400–649', action: 'Formal procedure triggered' },
    investigation: { label: 'Investigation', badge: 'red',   range: '650+',    action: 'HR investigation mandatory' },
}

const VIOLATION_COLORS: Record<string, string> = {
    'Tardiness':        'bg-amber-50 border-amber-200 text-amber-700',
    'Early departure':  'bg-orange-50 border-orange-200 text-orange-700',
    'Extended break':   'bg-red-50 border-red-200 text-status-red',
    'AUX overrun':      'bg-violet-50 border-violet-200 text-violet-700',
    'Schedule gap':     'bg-blue-50 border-blue-200 text-blue-700',
}

const PATTERN_ICONS: Record<string, string> = {
    'Early shift lateness (07:00)': '⏰',
    'Monday tardiness': '📅',
    'Extended breaks — peak hours': '☕',
    'Monday': '📅',
    'Friday': '📅',
    'Early shift': '⏰',
    'Peak hour': '📈',
    'End of day': '🕒',
}

// ─── Agent row ────────────────────────────────────────────────────────────────
function AgentRow({ agent, onCreateTicket, ticketFired }: {
    agent: AdhBradfordAgent
    onCreateTicket: (a: AdhBradfordAgent) => void
    ticketFired: boolean
}) {
    const [expanded, setExpanded] = useState(false)
    const cfg = THRESHOLD_CONFIG[agent.threshold]
    const isRed = agent.threshold === 'ticket' || agent.threshold === 'escalation' || agent.threshold === 'investigation'

    return (
        <>
            <tr
                className={`border-b border-surface-border cursor-pointer hover:bg-surface-muted/30 ${isRed ? 'bg-red-50/30' : agent.threshold === 'amber' ? 'bg-amber-50/20' : ''}`}
                onClick={() => setExpanded((p) => !p)}
            >
                <td className="p-3">
                    <div className="flex items-center gap-2">
                        {expanded ? <ChevronUp size={13} className="text-brand-gray shrink-0" /> : <ChevronDown size={13} className="text-brand-gray shrink-0" />}
                        <span className="text-xs font-medium">{agent.name}</span>
                    </div>
                </td>
                <td className="p-3 text-center text-xs font-bold">{agent.spells}</td>
                <td className="p-3 text-center text-xs">{agent.days}</td>
                <td className="p-3 text-center">
                    <span className={`text-base font-bold ${isRed ? 'text-status-red' : agent.threshold === 'amber' ? 'text-status-amber' : 'text-status-green'}`}>
                        {agent.score}
                    </span>
                </td>
                <td className="p-3">
                    <Badge variant={cfg.badge}>{cfg.label}</Badge>
                </td>
                <td className="p-3">
                    <span className={`rounded border px-1.5 py-0.5 text-[10px] font-medium ${VIOLATION_COLORS[agent.topViolationType] ?? 'bg-surface-muted border-surface-border text-brand-gray'}`}>
                        {agent.topViolationType}
                    </span>
                </td>
                <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                        {agent.patterns.map((p) => (
                            <span key={p} className="rounded-full border border-violet-200 bg-violet-50 px-1.5 py-0.5 text-[10px] text-violet-700">
                                {PATTERN_ICONS[p] ?? '⚠'} {p}
                            </span>
                        ))}
                    </div>
                </td>
                <td className="p-3" onClick={(e) => e.stopPropagation()}>
                    {isRed && (
                        ticketFired
                            ? <Badge variant="green">Ticket raised</Badge>
                            : (
                                <button
                                    type="button"
                                    onClick={() => onCreateTicket(agent)}
                                    className="flex items-center gap-1 rounded-lg bg-red-100 px-2 py-1 text-[10px] font-medium text-status-red hover:bg-red-200"
                                >
                                    <Ticket size={11} /> Create ticket
                                </button>
                            )
                    )}
                </td>
            </tr>

            {/* Expanded violation history — UC-2B-ADH */}
            {expanded && (
                <tr className="border-b border-surface-border bg-surface-muted/20">
                    <td colSpan={8} className="px-4 py-3">
                        {agent.history.length === 0 ? (
                            <p className="text-xs text-brand-gray">No adherence violations recorded this period.</p>
                        ) : (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-[10px] font-bold uppercase tracking-wide text-brand-gray">Adherence Violation History</p>
                                    {agent.id === '#22' && !ticketFired && (
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); onCreateTicket(agent) }}
                                            className="flex items-center gap-1.5 rounded-lg bg-status-red/10 px-2.5 py-1.5 text-xs font-medium text-status-red hover:bg-status-red/20"
                                        >
                                            <Ticket size={12} /> Create Coaching Ticket — Adherence · Behaviour · Recommend schedule adjustment
                                        </button>
                                    )}
                                </div>
                                {agent.history.map((h, i) => (
                                    <div key={i} className="flex flex-wrap items-start gap-3 rounded-lg border border-surface-border bg-white px-3 py-2.5 text-xs">
                                        <div className="shrink-0 w-28 text-brand-gray">{h.date}</div>
                                        <div className="shrink-0 w-24 text-brand-gray">{h.shift}</div>
                                        <div className="shrink-0">
                                            <span className={`rounded border px-1.5 py-0.5 text-[10px] font-medium ${VIOLATION_COLORS[h.type] ?? ''}`}>
                                                {h.type}
                                            </span>
                                        </div>
                                        <div className="shrink-0 font-medium w-16">+{h.duration} min</div>
                                        <div className="flex-1 text-brand-gray">{h.notes}</div>
                                        <div className="flex flex-wrap gap-1 shrink-0">
                                            {h.pattern.map((p) => (
                                                <span key={p} className="rounded-full border border-violet-200 bg-violet-50 px-1.5 py-0.5 text-[9px] text-violet-700">
                                                    {PATTERN_ICONS[p] ?? '⚠'} {p}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </td>
                </tr>
            )}
        </>
    )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function BradfordAdherencePage() {
    const [ticketFired, setTicketFired] = useState<Set<string>>(new Set())

    const flagged  = AGENTS.filter((a) => a.threshold !== 'green').length
    const redCount = AGENTS.filter((a) => a.threshold === 'ticket' || a.threshold === 'escalation' || a.threshold === 'investigation').length

    const handleCreateTicket = (agent: AdhBradfordAgent) => {
        if (ticketFired.has(agent.id)) { toast.info('Ticket already raised for this agent.'); return }
        setTicketFired((p) => new Set([...p, agent.id]))
        toast.success(`Coaching ticket created — ${agent.name}`, {
            description: `Category: Adherence · Root Cause: Behaviour · Bradford (Adherence) Score: ${agent.score} · ${agent.patterns.join(', ')} · Schedule adjustment recommended · 24h SLA`,
        })
    }

    const sorted = [...AGENTS].sort((a, b) => b.score - a.score)

    return (
        <div className="space-y-5">
            <div className="mb-1">
                <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold tracking-tight">Bradford Factor — Schedule Adherence</h1>
                    <Badge variant="amber">Adherence Only</Badge>
                </div>
                <p className="text-sm text-brand-gray mt-0.5">
                    Formula: B = S² × D · Tracks tardiness, early departures, extended breaks, AUX overruns · Recurring pattern detection
                </p>
            </div>

            {/* Not visible to L1 */}
            <div className="flex items-start gap-2 rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs text-blue-700">
                <Info size={14} className="mt-0.5 shrink-0" />
                <p>This page is <strong>not visible to Level 1 agents</strong>. Agents see only their own On-Time Rate and Schedule Adherence % on Home and Performance — no Bradford scores, no pattern flags.</p>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatCard label="Total Agents" value={AGENTS.length} variant="default" />
                <StatCard label="Flagged (Amber+)" value={flagged} variant={flagged > 0 ? 'amber' : 'green'} />
                <StatCard label="Red (Ticket+)" value={redCount} variant={redCount > 0 ? 'red' : 'green'} />
                <StatCard label="Auto-tickets Pending" value={redCount - ticketFired.size} variant={redCount - ticketFired.size > 0 ? 'amber' : 'green'} />
            </div>

            {/* Threshold reference */}
            <Card>
                <div className="mb-3 flex items-center gap-2">
                    <ShieldCheck size={15} className="text-brand-gray" />
                    <h2 className="text-sm font-semibold">Threshold Reference — Adherence Bradford</h2>
                    <span className="ml-auto text-[10px] text-brand-gray italic">Independent scale from Sick Leave Bradford</span>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 text-xs">
                    {Object.entries(THRESHOLD_CONFIG).map(([key, cfg]) => (
                        <div key={key} className="rounded-lg border border-surface-border p-2.5 text-center">
                            <Badge variant={cfg.badge}>{cfg.label}</Badge>
                            <p className="mt-1.5 font-bold text-sm">{cfg.range}</p>
                            <p className="mt-0.5 text-brand-gray text-[10px]">{cfg.action}</p>
                        </div>
                    ))}
                </div>
                <p className="mt-2.5 text-xs text-brand-gray">
                    Formula: <strong>B = S² × D</strong> where S = number of separate violation instances, D = total days with violations.
                    Example: 9 tardiness spells across 2 days = 9²×2 = <strong>162</strong> (ticket) vs 1 day with 9 violations = 1²×1 = 1 (green).
                    Each violation type is tracked individually but scored together.
                </p>
            </Card>

            {/* UC-2B-ADH highlight */}
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                <div className="flex items-center gap-2 mb-2">
                    <AlertCircle size={15} className="text-status-red shrink-0" />
                    <p className="text-sm font-semibold text-status-red">UC-2B-ADH — Agent #22 flagged (Score: 162)</p>
                </div>
                <p className="text-xs text-red-700">
                    9 violation spells across 2 days · Pattern: <strong>consistently late on Early shifts (07:00)</strong> + <strong>extended breaks during peak hours</strong>.
                    Expand Agent #22 row to see full violation history and create coaching ticket (Category: Adherence · Root Cause: Behaviour · Schedule adjustment recommendation).
                </p>
            </div>

            {/* Auto-ticket trigger info */}
            <div className="rounded-xl border border-surface-border bg-surface-muted/30 p-3 text-xs text-brand-gray">
                <span className="font-semibold text-foreground">Auto-ticket trigger:</span>
                {' '}When adherence Bradford score reaches 125+, a coaching ticket auto-fires to the TL Kanban Board
                (Category: Adherence · Root Cause: Behaviour). Ticket includes score, violation types, pattern flags.
                24h acknowledge → 24h action SLA. Escalated to L3 after 48h if not actioned.
            </div>

            {/* Agent table */}
            <Card padding={false}>
                <div className="border-b border-surface-border p-4">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-gray">
                        Team — Adherence Bradford Scores (click row for violation history)
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-surface-border bg-surface-muted/40 text-[11px] text-brand-gray">
                                <th className="p-3 text-left font-medium">Agent</th>
                                <th className="p-3 text-center font-medium">S (Violation Spells)</th>
                                <th className="p-3 text-center font-medium">D (Days w/ Violations)</th>
                                <th className="p-3 text-center font-medium">Score S²×D</th>
                                <th className="p-3 text-left font-medium">Status</th>
                                <th className="p-3 text-left font-medium">Top Violation</th>
                                <th className="p-3 text-left font-medium">Patterns</th>
                                <th className="p-3 text-left font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sorted.map((a) => (
                                <AgentRow
                                    key={a.id}
                                    agent={a}
                                    onCreateTicket={handleCreateTicket}
                                    ticketFired={ticketFired.has(a.id)}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    )
}
