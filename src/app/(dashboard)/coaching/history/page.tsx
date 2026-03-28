'use client'

import { useState } from 'react'
import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import { Input } from '@/components/atoms/Input'
import { Search, ChevronDown, ChevronUp } from 'lucide-react'

type KSBRoot = 'Knowledge' | 'Skill' | 'Behaviour'
type CoachingCategory = 'Productivity' | 'Quality' | 'Adherence'
type CoachingType = 'One-on-One' | 'Written'

interface HistoryEntry {
    id: string
    date: string
    agentName: string
    category: CoachingCategory
    rootCause: KSBRoot
    coachingType: CoachingType
    notes: string
    phrases?: string[]
    followUpDate: string
    outcome: 'Improved' | 'Partial Improvement' | 'No Change' | 'In Progress' | 'Pending'
}

const HISTORY: HistoryEntry[] = [
    {
        id: 'h-001', date: '2026-03-25', agentName: 'Agent #7', category: 'Productivity',
        rootCause: 'Knowledge', coachingType: 'One-on-One',
        notes: 'Briefed agent on new product catalogue. Assigned Product Knowledge e-learning module. Agent was handling new product enquiries without training.',
        followUpDate: '2026-04-04', outcome: 'Partial Improvement',
    },
    {
        id: 'h-002', date: '2026-03-28', agentName: 'Ella Brooks', category: 'Quality',
        rootCause: 'Skill', coachingType: 'One-on-One',
        notes: 'QA 62% — Call Handling. Rushes under pressure. Side-by-side coaching + 3 monitored calls within 48h.',
        phrases: [
            'Opening: "Thank you for calling Client A. My name is Ella, how can I help you today?"',
            'Confirmation: "Just to make sure I understand, you\'re experiencing [issue]. Is that right?"',
            'Hold: "I\'ll need about 2 minutes to check this. May I place you on a brief hold?"',
            'Closing: "Is there anything else I can help you with today?"',
        ],
        followUpDate: '2026-03-30', outcome: 'In Progress',
    },
    {
        id: 'h-003', date: '2026-03-24', agentName: 'Agent #12', category: 'Adherence',
        rootCause: 'Knowledge', coachingType: 'One-on-One',
        notes: 'Schedule adherence 83% — agent was unaware of AUX code policy for personal time vs break time. Policy explained and documented.',
        followUpDate: '2026-03-28', outcome: 'Improved',
    },
    {
        id: 'h-004', date: '2026-03-22', agentName: 'Agent #22', category: 'Adherence',
        rootCause: 'Behaviour', coachingType: 'Written',
        notes: 'Written warning sent for repeated extended break overruns (3 overruns in 2 shifts). Policy sent. Consequences documented.',
        followUpDate: '2026-04-04', outcome: 'In Progress',
    },
    {
        id: 'h-005', date: '2026-03-18', agentName: 'Grace Kim', category: 'Quality',
        rootCause: 'Skill', coachingType: 'One-on-One',
        notes: 'CSAT < 60% on 6 interactions. De-escalation skills practised. Call shadowing with senior agent arranged.',
        phrases: [
            'De-escalation: "I completely understand your frustration. Let me personally make sure this gets resolved today."',
            'Empathy: "That sounds really inconvenient. I\'m sorry you\'re dealing with this."',
        ],
        followUpDate: '2026-03-31', outcome: 'Improved',
    },
    {
        id: 'h-006', date: '2026-03-15', agentName: 'Ryan Costa', category: 'Adherence',
        rootCause: 'Behaviour', coachingType: 'One-on-One',
        notes: 'Late 3 times in 5 days. Mon/Fri pattern. Discussed impact on team SL. Agent cited transport issues. Flexible start time accommodation discussed.',
        followUpDate: '2026-03-22', outcome: 'No Change',
    },
    {
        id: 'h-007', date: '2026-03-10', agentName: 'Agent #7', category: 'Productivity',
        rootCause: 'Knowledge', coachingType: 'One-on-One',
        notes: 'ACW overrun 90s vs 45s target. Agent not using CRM shortcuts. Full CRM walkthrough conducted.',
        followUpDate: '2026-03-17', outcome: 'Improved',
    },
    {
        id: 'h-008', date: '2026-03-08', agentName: 'Agent #12', category: 'Productivity',
        rootCause: 'Skill', coachingType: 'Written',
        notes: 'AHT 6.2 min vs 5.0 target. Call structuring issue. Sent call handling guide with timing benchmarks.',
        followUpDate: '2026-03-15', outcome: 'Improved',
    },
]

const OUTCOME_CFG: Record<HistoryEntry['outcome'], 'green' | 'amber' | 'red' | 'grey' | 'blue'> = {
    Improved: 'green',
    'Partial Improvement': 'amber',
    'No Change': 'red',
    'In Progress': 'blue',
    Pending: 'grey',
}

const CATEGORY_CFG: Record<CoachingCategory, 'amber' | 'blue' | 'red'> = {
    Productivity: 'amber',
    Quality: 'blue',
    Adherence: 'red',
}

const KSB_CFG: Record<KSBRoot, string> = {
    Knowledge: 'text-blue-600 bg-blue-50 border-blue-200',
    Skill: 'text-green-700 bg-green-50 border-green-200',
    Behaviour: 'text-red-700 bg-red-50 border-red-200',
}

function HistoryCard({ entry }: { entry: HistoryEntry }) {
    const [expanded, setExpanded] = useState(false)

    return (
        <div className="rounded-xl border border-surface-border bg-white">
            <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                className="flex w-full items-center gap-3 p-3 text-left hover:bg-surface-muted/30"
            >
                <div className="min-w-[80px] text-xs text-brand-gray">{entry.date}</div>
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-sm font-medium">{entry.agentName}</span>
                        <Badge variant={CATEGORY_CFG[entry.category]}>{entry.category}</Badge>
                        <span className={`rounded border px-1.5 py-0.5 text-[10px] font-medium ${KSB_CFG[entry.rootCause]}`}>{entry.rootCause}</span>
                        <span className="text-[11px] text-brand-gray">{entry.coachingType}</span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-brand-gray">{entry.notes.slice(0, 80)}…</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={OUTCOME_CFG[entry.outcome]}>{entry.outcome}</Badge>
                    {expanded ? <ChevronUp size={14} className="text-brand-gray" /> : <ChevronDown size={14} className="text-brand-gray" />}
                </div>
            </button>

            {expanded && (
                <div className="border-t border-surface-border p-4 text-sm space-y-3">
                    <div>
                        <p className="text-xs font-medium text-brand-gray mb-1">Coaching Notes</p>
                        <p className="text-sm">{entry.notes}</p>
                    </div>
                    {entry.phrases && entry.phrases.length > 0 && (
                        <div>
                            <p className="text-xs font-medium text-brand-gray mb-1">Specific Phrases / Scripts</p>
                            <ul className="space-y-1">
                                {entry.phrases.map((p, i) => (
                                    <li key={i} className="rounded-lg border border-surface-border bg-surface-muted/30 px-3 py-1.5 text-xs">{p}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <div className="flex items-center gap-6 text-xs">
                        <span className="text-brand-gray">Follow-up date: <span className="font-medium text-foreground">{entry.followUpDate}</span></span>
                        <span className="text-brand-gray">Outcome: <Badge variant={OUTCOME_CFG[entry.outcome]}>{entry.outcome}</Badge></span>
                    </div>
                </div>
            )}
        </div>
    )
}

export default function CoachingHistoryPage() {
    const [search, setSearch] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('All')
    const [rootFilter, setRootFilter] = useState('All')

    const filtered = HISTORY.filter((e) => {
        const matchesSearch =
            search === '' ||
            e.agentName.toLowerCase().includes(search.toLowerCase()) ||
            e.notes.toLowerCase().includes(search.toLowerCase())
        const matchesCat = categoryFilter === 'All' || e.category === categoryFilter
        const matchesRoot = rootFilter === 'All' || e.rootCause === rootFilter
        return matchesSearch && matchesCat && matchesRoot
    })

    return (
        <div className="space-y-5">
            <div className="mb-2">
                <h1 className="text-xl font-bold tracking-tight">Coaching History</h1>
                <p className="text-sm text-brand-gray">Per-agent timeline · all tickets · actions · phrases · outcomes</p>
            </div>

            {/* Search & filters */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="relative min-w-[220px]">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gray" />
                    <Input
                        placeholder="Search agent or notes…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-8"
                    />
                </div>
                <div className="flex gap-1">
                    {['All', 'Productivity', 'Quality', 'Adherence'].map((c) => (
                        <button
                            key={c}
                            type="button"
                            onClick={() => setCategoryFilter(c)}
                            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${categoryFilter === c ? 'bg-foreground text-white border-foreground' : 'border-surface-border text-brand-gray hover:border-foreground/40'}`}
                        >
                            {c}
                        </button>
                    ))}
                </div>
                <div className="flex gap-1">
                    {['All', 'Knowledge', 'Skill', 'Behaviour'].map((r) => (
                        <button
                            key={r}
                            type="button"
                            onClick={() => setRootFilter(r)}
                            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${rootFilter === r ? 'bg-foreground text-white border-foreground' : 'border-surface-border text-brand-gray hover:border-foreground/40'}`}
                        >
                            {r}
                        </button>
                    ))}
                </div>
                <span className="text-xs text-brand-gray">{filtered.length} entries</span>
            </div>

            {/* Timeline */}
            <div className="space-y-2">
                {filtered.length === 0 ? (
                    <Card><p className="text-center text-sm text-brand-gray py-8">No coaching records match your filters.</p></Card>
                ) : (
                    filtered.map((entry) => <HistoryCard key={entry.id} entry={entry} />)
                )}
            </div>
        </div>
    )
}
