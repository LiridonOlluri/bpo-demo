'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import { StatCard } from '@/components/molecules/StatCard'
import { AlertBanner } from '@/components/molecules/AlertBanner'
import {
    ChevronDown, ChevronUp, AlertCircle, CalendarDays,
    ClipboardCheck, ShieldAlert, Info,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────
interface SickAbsence {
    date: string
    duration: number    // days
    reason: string
    pattern: string[]   // e.g. ['Mon', 'Pre-holiday']
    notes: string
}

interface SickBradfordAgent {
    id: string
    name: string
    spells: number      // S
    days: number        // D
    score: number       // S² × D (demo data: maintained from spec)
    threshold: 'green' | 'amber' | 'ticket' | 'escalation' | 'investigation'
    patterns: string[]
    excluded: boolean
    exclusionReason?: string
    history: SickAbsence[]
    interviewDone: boolean
}

// ─── Demo data (UC-2B + supporting cast) ─────────────────────────────────────
// Formula: B = S² × D. Ryan Costa: spec says 186 (kept for demo consistency).
// Score derivation: 3 spells of varying length across months → 186 by prior period carryover
const AGENTS: SickBradfordAgent[] = [
    {
        id: 'ryan', name: 'Ryan Costa', spells: 3, days: 8, score: 186,
        threshold: 'ticket',
        patterns: ['Mon/Fri clustering', 'Pre-holiday'],
        excluded: false, interviewDone: false,
        history: [
            { date: '2026-03-03 Mon', duration: 1, reason: 'Unwell', pattern: ['Monday', 'Day before holiday'], notes: '' },
            { date: '2026-02-27 Fri', duration: 1, reason: 'Stomach ache', pattern: ['Friday'], notes: '' },
            { date: '2026-01-12 Mon', duration: 6, reason: 'Flu / respiratory', pattern: ['Monday start'], notes: 'Provided medical cert' },
        ],
    },
    {
        id: 'priya', name: 'Priya Sharma', spells: 2, days: 3, score: 72,
        threshold: 'amber',
        patterns: ['Monday frequency'],
        excluded: false, interviewDone: false,
        history: [
            { date: '2026-03-09 Mon', duration: 1, reason: 'Headache', pattern: ['Monday'], notes: '' },
            { date: '2026-02-16 Mon', duration: 2, reason: 'Flu', pattern: ['Monday start'], notes: '' },
        ],
    },
    {
        id: 'quinn', name: 'Quinn Davis', spells: 1, days: 2, score: 2,
        threshold: 'green',
        patterns: [],
        excluded: false, interviewDone: false,
        history: [
            { date: '2026-03-18 Wed', duration: 2, reason: 'Flu', pattern: [], notes: 'Provided medical cert' },
        ],
    },
    {
        id: 'ella', name: 'Ella Brooks', spells: 0, days: 0, score: 0,
        threshold: 'green',
        patterns: [],
        excluded: false, interviewDone: false,
        history: [],
    },
    {
        id: 'alice', name: 'Alice Monroe', spells: 1, days: 1, score: 1,
        threshold: 'green',
        patterns: [],
        excluded: false, interviewDone: false,
        history: [
            { date: '2026-02-05 Thu', duration: 1, reason: 'Migraine', pattern: [], notes: '' },
        ],
    },
    {
        id: 'grace', name: 'Grace Kim', spells: 0, days: 0, score: 0,
        threshold: 'green',
        patterns: [],
        excluded: true, exclusionReason: 'Pregnancy — exclusion applied',
        interviewDone: false,
        history: [],
    },
    {
        id: '#7', name: 'Agent #7', spells: 1, days: 3, score: 3,
        threshold: 'green',
        patterns: [],
        excluded: false, interviewDone: false,
        history: [
            { date: '2026-03-10 Tue', duration: 3, reason: 'Surgery recovery', pattern: [], notes: 'Medical documentation provided' },
        ],
    },
    {
        id: '#12', name: 'Agent #12', spells: 1, days: 1, score: 1,
        threshold: 'green',
        patterns: [],
        excluded: false, interviewDone: false,
        history: [
            { date: '2026-03-10 Tue', duration: 1, reason: 'Unwell', pattern: [], notes: '' },
        ],
    },
    {
        id: '#22', name: 'Agent #22', spells: 0, days: 0, score: 0,
        threshold: 'green',
        patterns: [],
        excluded: false, interviewDone: false,
        history: [],
    },
    {
        id: '#33', name: 'Agent #33', spells: 1, days: 1, score: 1,
        threshold: 'green',
        patterns: [],
        excluded: false, interviewDone: false,
        history: [],
    },
]

// ─── Threshold helpers ────────────────────────────────────────────────────────
type Threshold = SickBradfordAgent['threshold']

const THRESHOLD_CONFIG: Record<Threshold, { label: string; badge: 'green' | 'amber' | 'red' | 'grey'; range: string; action: string }> = {
    green:         { label: 'Green',         badge: 'green', range: '0–50',     action: 'Monitor only' },
    amber:         { label: 'Amber',         badge: 'amber', range: '51–124',   action: 'Informal discussion' },
    ticket:        { label: 'Red — Ticket',  badge: 'red',   range: '125–399',  action: 'Coaching ticket + Return-to-Work' },
    escalation:    { label: 'Escalation',    badge: 'red',   range: '400–649',  action: 'Formal procedure triggered' },
    investigation: { label: 'Investigation', badge: 'red',   range: '650+',     action: 'HR investigation mandatory' },
}

function thresholdFromScore(score: number): Threshold {
    if (score >= 650) return 'investigation'
    if (score >= 400) return 'escalation'
    if (score >= 125) return 'ticket'
    if (score >= 51)  return 'amber'
    return 'green'
}

const PATTERN_ICONS: Record<string, string> = {
    'Mon/Fri clustering': '📅',
    'Monday frequency': '📅',
    'Monday start': '📅',
    'Monday': '📅',
    'Friday': '📅',
    'Pre-holiday': '🎉',
    'Post-holiday': '🎉',
    'Day before holiday': '🎉',
    'Same month repeat': '🔁',
}

// ─── Return-to-Work Interview Modal ──────────────────────────────────────────
function ReturnToWorkModal({ agent, onClose, onComplete }: {
    agent: SickBradfordAgent
    onClose: () => void
    onComplete: (id: string) => void
}) {
    const [finding, setFinding] = useState('')
    const [healthSupport, setHealthSupport] = useState(false)
    const [performanceConcern, setPerformanceConcern] = useState(false)

    const handleSubmit = () => {
        if (!finding.trim()) { toast.error('Please enter findings before completing.'); return }
        onComplete(agent.id)
        toast.success(`Return-to-Work interview documented for ${agent.name}`, {
            description: agent.score > 200
                ? 'Score >200 — HR auto-notified as per policy.'
                : 'Interview findings saved. No HR escalation required at this score.',
        })
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
                <div className="border-b border-surface-border p-4">
                    <h2 className="text-sm font-semibold">Return-to-Work Interview — {agent.name}</h2>
                    <p className="mt-0.5 text-xs text-brand-gray">
                        Bradford Score: <span className="font-bold">{agent.score}</span> · {agent.spells} spells × {agent.days} days
                        {agent.score > 200 && <span className="ml-1 text-status-red font-medium">HR will be auto-notified (score &gt;200)</span>}
                    </p>
                </div>
                <div className="p-4 space-y-3">
                    <div>
                        <label className="mb-1 block text-xs font-medium text-brand-gray">Findings / Discussion summary</label>
                        <textarea
                            rows={3}
                            className="w-full rounded-lg border border-surface-border px-3 py-2 text-xs outline-none focus:border-brand-primary"
                            placeholder="e.g. Agent confirmed illness was genuine. Discussed attendance policy. No further action required / referred to OH..."
                            value={finding}
                            onChange={(e) => setFinding(e.target.value)}
                        />
                    </div>
                    <label className="flex items-center gap-2 text-xs cursor-pointer">
                        <input type="checkbox" className="rounded" checked={healthSupport} onChange={(e) => setHealthSupport(e.target.checked)} />
                        Referred to health support / Occupational Health
                    </label>
                    <label className="flex items-center gap-2 text-xs cursor-pointer">
                        <input type="checkbox" className="rounded" checked={performanceConcern} onChange={(e) => setPerformanceConcern(e.target.checked)} />
                        Formal attendance concern raised (enters formal procedure)
                    </label>
                    {agent.score > 200 && (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-status-red">
                            <AlertCircle size={12} className="mr-1 inline" />
                            Score &gt;200 — HR will be automatically notified upon submission.
                        </div>
                    )}
                    <div className="flex gap-2 pt-1">
                        <Button onClick={handleSubmit} className="flex-1 justify-center" size="sm">Complete Interview</Button>
                        <Button variant="ghost" onClick={onClose} size="sm">Cancel</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ─── Agent detail row ─────────────────────────────────────────────────────────
function AgentRow({ agent, onStartInterview, onAutoTicket }: {
    agent: SickBradfordAgent
    onStartInterview: (a: SickBradfordAgent) => void
    onAutoTicket: (a: SickBradfordAgent) => void
}) {
    const [expanded, setExpanded] = useState(false)
    const cfg = THRESHOLD_CONFIG[agent.threshold]

    return (
        <>
            <tr
                className={`border-b border-surface-border hover:bg-surface-muted/30 cursor-pointer ${agent.threshold === 'ticket' || agent.threshold === 'escalation' || agent.threshold === 'investigation' ? 'bg-red-50/30' : agent.threshold === 'amber' ? 'bg-amber-50/20' : ''}`}
                onClick={() => setExpanded((p) => !p)}
            >
                <td className="p-3">
                    <div className="flex items-center gap-2">
                        {expanded ? <ChevronUp size={13} className="text-brand-gray shrink-0" /> : <ChevronDown size={13} className="text-brand-gray shrink-0" />}
                        <span className="text-xs font-medium">{agent.name}</span>
                        {agent.excluded && <Badge variant="grey">{agent.exclusionReason?.split(' — ')[0] ?? 'Excluded'}</Badge>}
                    </div>
                </td>
                <td className="p-3 text-center text-xs font-bold">{agent.excluded ? '—' : agent.spells}</td>
                <td className="p-3 text-center text-xs">{agent.excluded ? '—' : agent.days}</td>
                <td className="p-3 text-center">
                    <span className={`text-base font-bold ${agent.threshold === 'ticket' || agent.threshold === 'escalation' || agent.threshold === 'investigation' ? 'text-status-red' : agent.threshold === 'amber' ? 'text-status-amber' : 'text-status-green'}`}>
                        {agent.excluded ? '—' : agent.score}
                    </span>
                </td>
                <td className="p-3">
                    {agent.excluded
                        ? <Badge variant="grey">Excluded</Badge>
                        : <Badge variant={cfg.badge}>{cfg.label}</Badge>
                    }
                </td>
                <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                        {agent.patterns.map((p) => (
                            <span key={p} className="rounded-full border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[10px] text-amber-700">
                                {PATTERN_ICONS[p] ?? '⚠'} {p}
                            </span>
                        ))}
                    </div>
                </td>
                <td className="p-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex flex-wrap gap-1.5">
                        {(agent.threshold === 'ticket' || agent.threshold === 'escalation') && !agent.interviewDone && (
                            <button
                                type="button"
                                onClick={() => onStartInterview(agent)}
                                className="flex items-center gap-1 rounded-lg bg-amber-100 px-2 py-1 text-[10px] font-medium text-amber-700 hover:bg-amber-200"
                            >
                                <ClipboardCheck size={11} /> Return-to-Work
                            </button>
                        )}
                        {agent.interviewDone && (
                            <Badge variant="green">Interview done</Badge>
                        )}
                        {(agent.threshold === 'ticket' || agent.threshold === 'escalation') && (
                            <button
                                type="button"
                                onClick={() => onAutoTicket(agent)}
                                className="flex items-center gap-1 rounded-lg bg-red-100 px-2 py-1 text-[10px] font-medium text-status-red hover:bg-red-200"
                            >
                                Auto-ticket
                            </button>
                        )}
                    </div>
                </td>
            </tr>

            {/* Expanded absence history */}
            {expanded && (
                <tr className="border-b border-surface-border bg-surface-muted/20">
                    <td colSpan={7} className="px-4 py-3">
                        {agent.history.length === 0 ? (
                            <p className="text-xs text-brand-gray">No sick absences recorded this period.</p>
                        ) : (
                            <div className="space-y-2">
                                <p className="text-[10px] font-bold uppercase tracking-wide text-brand-gray mb-2">Sick Absence History — This Period</p>
                                {agent.history.map((h, i) => (
                                    <div key={i} className="flex items-start gap-3 rounded-lg border border-surface-border bg-white px-3 py-2.5 text-xs">
                                        <div className="shrink-0 w-28 text-brand-gray">{h.date}</div>
                                        <div className="shrink-0 w-16 font-medium">{h.duration} day{h.duration !== 1 ? 's' : ''}</div>
                                        <div className="flex-1">
                                            <span className="font-medium">{h.reason}</span>
                                            {h.notes && <span className="ml-1 text-brand-gray">· {h.notes}</span>}
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                            {h.pattern.map((p) => (
                                                <span key={p} className="rounded-full border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[9px] text-amber-700">
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
export default function BradfordSickPage() {
    const [agents, setAgents] = useState<SickBradfordAgent[]>(AGENTS)
    const [interviewTarget, setInterviewTarget] = useState<SickBradfordAgent | null>(null)
    const [ticketFired, setTicketFired] = useState<Set<string>>(new Set())

    const flagged    = agents.filter((a) => !a.excluded && a.threshold !== 'green').length
    const redCount   = agents.filter((a) => !a.excluded && (a.threshold === 'ticket' || a.threshold === 'escalation' || a.threshold === 'investigation')).length
    const pendingInterview = agents.filter((a) => !a.excluded && (a.threshold === 'ticket' || a.threshold === 'escalation') && !a.interviewDone).length

    const handleInterviewComplete = (id: string) => {
        setAgents((prev) => prev.map((a) => a.id === id ? { ...a, interviewDone: true } : a))
    }

    const handleAutoTicket = (agent: SickBradfordAgent) => {
        if (ticketFired.has(agent.id)) { toast.info('Ticket already raised for this agent.'); return }
        setTicketFired((p) => new Set([...p, agent.id]))
        toast.success(`Coaching ticket created — ${agent.name}`, {
            description: `Category: Adherence · Bradford (Sick) Score: ${agent.score} · ${agent.patterns.join(', ') || 'No pattern'} · 24h acknowledgement SLA`,
        })
    }

    const sorted = [...agents].sort((a, b) => b.score - a.score)

    return (
        <div className="space-y-5">
            <div className="mb-1">
                <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold tracking-tight">Bradford Factor — Sick Leave</h1>
                    <Badge variant="red">Sick Leave Only</Badge>
                </div>
                <p className="text-sm text-brand-gray mt-0.5">
                    Formula: B = S² × D · Tracks sick leave absences only · Pattern misuse detection
                </p>
            </div>

            {/* Not visible to L1 banner */}
            <div className="flex items-start gap-2 rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs text-blue-700">
                <Info size={14} className="mt-0.5 shrink-0" />
                <p>This page is <strong>not visible to Level 1 agents</strong>. Agents see only their own sick leave balance on Leave &amp; Calendar — no scores, no patterns, no misuse flags.</p>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatCard label="Total Agents" value={agents.filter((a) => !a.excluded).length} variant="default" />
                <StatCard label="Flagged (Amber+)" value={flagged} variant={flagged > 0 ? 'amber' : 'green'} />
                <StatCard label="Red (Ticket+)" value={redCount} variant={redCount > 0 ? 'red' : 'green'} />
                <StatCard label="Interviews Pending" value={pendingInterview} variant={pendingInterview > 0 ? 'amber' : 'green'} />
            </div>

            {/* Threshold legend */}
            <Card>
                <div className="mb-3 flex items-center gap-2">
                    <ShieldAlert size={15} className="text-brand-gray" />
                    <h2 className="text-sm font-semibold">Threshold Reference — Sick Leave Bradford</h2>
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
                    Formula: <strong>B = S² × D</strong> where S = number of separate sick spells, D = total days absent.
                    Example: 5 single-day absences = 5²×5 = 125 (ticket) vs 1 five-day absence = 1²×5 = 5 (green).
                    <span className="ml-2 font-medium text-amber-700">Exclusions: pregnancy, disability, bereavement.</span>
                </p>
            </Card>

            {/* Pattern detection info */}
            <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                <div>
                    <strong>Pattern detection active.</strong>
                    {' '}Flags: Mon/Fri clustering, pre/post-holiday spikes, same-month frequency, 3+ spells within 90 days.
                    Agents with pattern badges require Return-to-Work interview before threshold action is complete.
                </div>
            </div>

            {/* Coaching ticket auto-trigger info */}
            <div className="rounded-xl border border-surface-border bg-surface-muted/30 p-3 text-xs text-brand-gray">
                <span className="font-semibold text-foreground">Auto-ticket trigger:</span>
                {' '}When sick Bradford score reaches 125+, a coaching ticket auto-fires to the TL Kanban Board
                (Category: Adherence · sub-type: Sick Bradford). 24h acknowledge → 24h action SLA.
                Ticket includes score, spell count, pattern flags, and absence history link.
            </div>

            {/* Agent table */}
            <Card padding={false}>
                <div className="border-b border-surface-border p-4">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-gray">
                        Team — Sick Leave Bradford Scores (click row for absence history)
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-surface-border bg-surface-muted/40 text-[11px] text-brand-gray">
                                <th className="p-3 text-left font-medium">Agent</th>
                                <th className="p-3 text-center font-medium">S (Spells)</th>
                                <th className="p-3 text-center font-medium">D (Days)</th>
                                <th className="p-3 text-center font-medium">Score S²×D</th>
                                <th className="p-3 text-left font-medium">Status</th>
                                <th className="p-3 text-left font-medium">Patterns</th>
                                <th className="p-3 text-left font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sorted.map((a) => (
                                <AgentRow
                                    key={a.id}
                                    agent={a}
                                    onStartInterview={setInterviewTarget}
                                    onAutoTicket={handleAutoTicket}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Return-to-Work interview modal */}
            {interviewTarget && (
                <ReturnToWorkModal
                    agent={interviewTarget}
                    onClose={() => setInterviewTarget(null)}
                    onComplete={handleInterviewComplete}
                />
            )}
        </div>
    )
}
