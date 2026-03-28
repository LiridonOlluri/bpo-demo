'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import { CheckCircle2, X, AlertCircle, Info, ArrowLeftRight, Clock } from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────
export type DayStatus = 'E' | 'M' | 'L' | 'OFF' | 'PL' | 'SL' | 'TR' | 'NE' | 'OVR'

export interface ScheduleAgent {
    id: string
    name: string
    skill: string
    status: string
    shiftStart: string
    shiftEnd: string
    weeks: DayStatus[][]
}

// ─── Shared grid data ─────────────────────────────────────────────────────────
export const DAYS_W1 = ['Mon\n31/3', 'Tue\n1/4', 'Wed\n2/4', 'Thu\n3/4', 'Fri\n4/4', 'Sat\n5/4', 'Sun\n6/4']
export const DAYS_W2 = ['Mon\n7/4', 'Tue\n8/4', 'Wed\n9/4', 'Thu\n10/4', 'Fri\n11/4', 'Sat\n12/4', 'Sun\n13/4']
export const DAYS_W3 = ['Mon\n14/4', 'Tue\n15/4', 'Wed\n16/4', 'Thu\n17/4', 'Fri\n18/4', 'Sat\n19/4', 'Sun\n20/4']

export const SCHEDULE_AGENTS: ScheduleAgent[] = [
    { id: '#12',   name: 'Agent #12',    skill: 'Voice', status: 'FT', shiftStart: '07:00', shiftEnd: '15:00', weeks: [['E','E','E','M','E','OFF','OFF'],  ['E','E','E','E','E','OFF','OFF'],    ['E','E','OFF','E','E','E','OFF']]    },
    { id: '#7',    name: 'Agent #7',     skill: 'Voice', status: 'FT', shiftStart: '10:00', shiftEnd: '18:00', weeks: [['M','M','M','M','OFF','OFF','M'],   ['M','OFF','M','M','M','M','OFF'],    ['OFF','M','M','M','OFF','M','M']]   },
    { id: '#22',   name: 'Agent #22',    skill: 'Voice', status: 'FT', shiftStart: '07:00', shiftEnd: '15:00', weeks: [['E','E','OFF','E','E','OFF','OFF'], ['E','E','E','E','OFF','OFF','E'],    ['E','E','E','OFF','E','E','OFF']]   },
    { id: '#28',   name: 'Agent #28',    skill: 'Voice', status: 'FT', shiftStart: '16:00', shiftEnd: '00:00', weeks: [['L','L','OFF','L','L','OFF','OFF'], ['L','OFF','L','L','L','L','OFF'],    ['L','L','L','OFF','OFF','L','L']]   },
    { id: '#33',   name: 'Agent #33',    skill: 'Voice', status: 'FT', shiftStart: '10:00', shiftEnd: '18:00', weeks: [['M','M','M','E','M','OFF','OFF'],   ['OFF','M','M','M','M','M','OFF'],    ['M','M','OFF','M','M','OFF','M']]   },
    { id: 'alice', name: 'Alice Monroe', skill: 'Voice', status: 'FT', shiftStart: '07:00', shiftEnd: '15:00', weeks: [['E','E','E','OFF','E','E','OFF'],   ['E','E','OFF','E','E','E','OFF'],    ['OFF','E','E','E','E','OFF','E']]   },
    { id: 'ella',  name: 'Ella Brooks',  skill: 'Voice', status: 'FT', shiftStart: '07:00', shiftEnd: '15:00', weeks: [['E','OFF','E','E','E','OFF','OFF'], ['E','E','E','OFF','E','E','OFF'],    ['E','E','E','E','OFF','OFF','E']]   },
    { id: 'frank', name: 'Frank Osei',   skill: 'Chat',  status: 'FT', shiftStart: '10:00', shiftEnd: '18:00', weeks: [['M','M','OFF','M','M','OFF','M'],   ['M','M','M','M','OFF','OFF','M'],    ['M','OFF','M','M','M','M','OFF']]   },
    { id: 'grace', name: 'Grace Kim',    skill: 'Chat',  status: 'FT', shiftStart: '10:00', shiftEnd: '18:00', weeks: [['M','TR','TR','TR','M','OFF','OFF'],['M','M','OFF','M','M','M','OFF'],    ['OFF','M','M','M','M','OFF','M']]   },
    { id: 'ryan',  name: 'Ryan Costa',   skill: 'Voice', status: 'FT', shiftStart: '07:00', shiftEnd: '15:00', weeks: [['SL','E','E','E','OFF','OFF','E'],  ['E','E','E','OFF','E','E','OFF'],    ['E','E','OFF','E','E','E','OFF']]   },
]

export const DAY_STYLE: Record<DayStatus, string> = {
    E:   'bg-white border-surface-border text-[10px]',
    M:   'bg-white border-surface-border text-[10px]',
    L:   'bg-white border-surface-border text-[10px]',
    OFF: 'bg-green-100 border-green-200 text-[10px] text-green-700',
    PL:  'bg-orange-100 border-orange-200 text-[10px] text-orange-700',
    SL:  'bg-red-100 border-red-200 text-[10px] text-red-700',
    TR:  'bg-blue-100 border-blue-200 text-[10px] text-blue-700',
    NE:  'bg-sky-100 border-sky-200 text-[10px] text-sky-700',
    OVR: 'bg-yellow-50 border-yellow-300 text-[10px] text-yellow-700',
}
export const DAY_LABEL: Record<DayStatus, string> = {
    E: '07-15', M: '10-18', L: '16-00', OFF: 'OFF', PL: 'P/L', SL: 'Sick', TR: 'Train', NE: 'Nest', OVR: 'OVR',
}
const SHIFT_FULL: Record<DayStatus, string> = {
    E: 'Early 07:00–15:00', M: 'Mid 10:00–18:00', L: 'Late 16:00–00:00',
    OFF: 'Day Off', PL: 'Paid Leave', SL: 'Sick Leave', TR: 'Training', NE: 'Nesting', OVR: 'Overtime',
}

const IS_WORKING: Record<DayStatus, boolean> = {
    E: true, M: true, L: true, OVR: true,
    OFF: false, PL: false, SL: false, TR: false, NE: false,
}

const INELIGIBLE_REASON: Partial<Record<DayStatus, string>> = {
    OFF: 'Day off',
    PL:  'On paid leave',
    SL:  'On sick leave',
    TR:  'In training',
    NE:  'Nesting day',
}

// ─── Swap-request state machine ───────────────────────────────────────────────
type SwapTarget = {
    agentId: string
    agentName: string
    weekIdx: number
    dayIdx: number
    dayLabel: string
    dayStatus: DayStatus
}

type SwapFlow =
    | { stage: 'selecting' }
    | { stage: 'pending';    partnerId: string; partnerName: string }
    | { stage: 'declined';   partnerId: string; partnerName: string }
    | { stage: 'validating'; partnerId: string; partnerName: string }
    | { stage: 'pending_tl'; partnerId: string; partnerName: string }
    | { stage: 'tl_approved' }
    | { stage: 'tl_rejected' }

const WEEK_LABELS = ['Week 1 (31 Mar–6 Apr)', 'Week 2 (7–13 Apr)', 'Week 3 (14–20 Apr)']

// ─── Props ────────────────────────────────────────────────────────────────────
interface TeamScheduleGridProps {
    /** 'agent' = request-swap interaction; 'tl' = approve/decline interaction */
    mode: 'agent' | 'tl'
    /** ID of the viewing agent (agent mode only) — highlights their row */
    viewerAgentId?: string
    /** TL-mode: callback when TL approves/declines — handled inline if omitted */
    onTlAction?: (action: 'approve' | 'decline') => void
}

// ─── Component ────────────────────────────────────────────────────────────────
export function TeamScheduleGrid({ mode, viewerAgentId = '#12' }: TeamScheduleGridProps) {
    const [activeWeek, setActiveWeek] = useState(0)
    const weekDays = [DAYS_W1, DAYS_W2, DAYS_W3][activeWeek]

    // TL mode state
    const [tlSwapApproved, setTlSwapApproved] = useState<'pending' | 'approved' | 'declined'>('pending')

    // Agent mode state
    const [swapTarget, setSwapTarget] = useState<SwapTarget | null>(null)
    const [swapFlow, setSwapFlow] = useState<SwapFlow>({ stage: 'selecting' })
    const [submittedSwaps, setSubmittedSwaps] = useState<Set<string>>(new Set())

    const viewerAgent = SCHEDULE_AGENTS.find((a) => a.id === viewerAgentId)

    const handleCellClick = (agent: ScheduleAgent, weekIdx: number, dayIdx: number) => {
        if (mode !== 'agent') return
        if (agent.id === viewerAgentId) return      // can't swap with yourself
        const dayStatus = agent.weeks[weekIdx][dayIdx]
        if (!IS_WORKING[dayStatus]) return           // can't swap an off/leave day
        const dayLabel = [DAYS_W1, DAYS_W2, DAYS_W3][weekIdx][dayIdx].replace('\n', ' ')
        setSwapTarget({ agentId: agent.id, agentName: agent.name, weekIdx, dayIdx, dayLabel, dayStatus })
        setSwapFlow({ stage: 'selecting' })
    }

    const handleRequestSwap = (partner: ScheduleAgent) => {
        setSwapFlow({ stage: 'pending', partnerId: partner.id, partnerName: partner.name })
    }

    const handlePartnerAccept = (partnerName: string) => {
        if (!swapTarget || !viewerAgent) return
        setSwapFlow({ stage: 'validating', partnerId: swapFlow.stage === 'pending' ? (swapFlow as { stage: 'pending'; partnerId: string; partnerName: string }).partnerId : '', partnerName })
        setTimeout(() => {
            const partnerId = swapFlow.stage === 'pending' ? (swapFlow as { stage: 'pending'; partnerId: string; partnerName: string }).partnerId : ''
            setSwapFlow({ stage: 'pending_tl', partnerId, partnerName })
            toast.success('Validation passed — TL notified', {
                description: `Sarah Chen (Team Lead) has been notified. Awaiting her approval on the ${swapTarget.dayLabel} swap.`,
            })
            const key = `${swapTarget.agentId}-w${swapTarget.weekIdx}-d${swapTarget.dayIdx}`
            setSubmittedSwaps((prev) => new Set([...prev, key]))
        }, 1200)
    }

    const handlePartnerDecline = (partnerName: string) => {
        const partnerId = swapFlow.stage === 'pending' ? (swapFlow as { stage: 'pending'; partnerId: string; partnerName: string }).partnerId : ''
        setSwapFlow({ stage: 'declined', partnerId, partnerName })
        toast.error(`${partnerName} declined the swap`, {
            description: 'TL is NOT notified for declined requests. Select another partner or cancel.',
        })
    }

    const resetSwap = () => {
        setSwapTarget(null)
        setSwapFlow({ stage: 'selecting' })
    }

    // Eligible swap partners for agent mode
    const getEligiblePartners = () => {
        if (!swapTarget || !viewerAgent) return []
        return SCHEDULE_AGENTS
            .filter((a) => a.id !== viewerAgentId)
            .map((a) => {
                const dayStatus = a.weeks[swapTarget.weekIdx][swapTarget.dayIdx]
                const myDayStatus = viewerAgent.weeks[swapTarget.weekIdx][swapTarget.dayIdx]
                const skillMismatch = a.skill !== viewerAgent.skill
                const notWorking = !IS_WORKING[dayStatus]
                const sameShift = dayStatus === myDayStatus
                const ineligible = skillMismatch || notWorking || sameShift
                const reason = skillMismatch
                    ? `Different skill (${a.skill})`
                    : notWorking
                    ? (INELIGIBLE_REASON[dayStatus] ?? 'Not working')
                    : sameShift
                    ? 'Same shift type — no benefit'
                    : null
                return { agent: a, dayStatus, ineligible, reason }
            })
    }

    const partners = getEligiblePartners()

    return (
        <div className="space-y-4">
            {/* Mode banner */}
            {mode === 'agent' && (
                <div className="flex items-start gap-2 rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs text-blue-700">
                    <Info size={14} className="mt-0.5 shrink-0" />
                    <p>
                        Your row is <strong>highlighted in blue</strong>. Click any working-shift cell on a team member&apos;s row to
                        {' '}<strong>request a shift swap</strong>. You cannot approve or decline — that is your Team Lead&apos;s authority.
                    </p>
                </div>
            )}
            {mode === 'tl' && (
                <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
                    <Info size={14} className="mt-0.5 shrink-0" />
                    <p>TL view: you can <strong>view</strong> this schedule and <strong>approve swap requests</strong>. Schedule generation and publication is WFM Manager (Level 4) authority.</p>
                </div>
            )}

            {/* 3-week grid */}
            <div className="overflow-hidden rounded-xl border border-surface-border">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-surface-border bg-white p-4">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-gray">3-Week Schedule Grid</h2>
                    <div className="flex flex-wrap gap-1">
                        {WEEK_LABELS.map((w, i) => (
                            <button key={i} type="button" onClick={() => setActiveWeek(i)}
                                className={`rounded-full border px-3 py-1 text-xs transition-colors ${activeWeek === i ? 'bg-foreground text-white border-foreground' : 'border-surface-border text-brand-gray hover:bg-surface-muted'}`}>
                                {w}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="border-b border-surface-border bg-surface-muted/40">
                                <th className="sticky left-0 z-10 bg-surface-muted/60 p-2 text-left font-medium text-brand-gray w-[120px]">Agent</th>
                                <th className="p-2 text-left font-medium text-brand-gray">Skill</th>
                                <th className="p-2 text-left font-medium text-brand-gray">Shift</th>
                                {weekDays.map((d, i) => (
                                    <th key={i} className="p-2 text-center font-medium text-brand-gray min-w-[52px] whitespace-pre-line leading-tight">{d}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {SCHEDULE_AGENTS.map((a) => {
                                const isViewer = mode === 'agent' && a.id === viewerAgentId
                                return (
                                    <tr
                                        key={a.id}
                                        className={`border-b border-surface-border last:border-0 ${
                                            isViewer
                                                ? 'bg-blue-50/60'
                                                : mode === 'agent' ? 'hover:bg-surface-muted/30' : `hover:bg-surface-muted/30 ${a.id === '#12' ? 'bg-green-50/40' : ''}`
                                        }`}
                                    >
                                        <td className={`sticky left-0 z-10 p-2 font-medium ${isViewer ? 'bg-blue-50/80' : 'bg-white'}`}>
                                            <span className="flex items-center gap-1">
                                                {a.name}
                                                {isViewer && <span className="rounded-full bg-blue-200 px-1.5 py-0.5 text-[9px] font-bold text-blue-700">You</span>}
                                            </span>
                                        </td>
                                        <td className="p-2">
                                            <Badge variant={a.skill === 'Voice' ? 'blue' : 'green'}>{a.skill}</Badge>
                                        </td>
                                        <td className="p-2 text-brand-gray">{a.shiftStart}–{a.shiftEnd}</td>
                                        {a.weeks[activeWeek].map((day, i) => {
                                            const key = `${a.id}-w${activeWeek}-d${i}`
                                            const isSubmitted = submittedSwaps.has(key)
                                            const isSwapTarget = swapTarget?.agentId === a.id && swapTarget?.weekIdx === activeWeek && swapTarget?.dayIdx === i
                                            const isClickable = mode === 'agent' && !isViewer && IS_WORKING[day]
                                            return (
                                                <td key={i} className="p-1 text-center">
                                                    {isSubmitted ? (
                                                        <div className="mx-auto flex h-8 w-11 items-center justify-center rounded border border-purple-200 bg-purple-50 text-[9px] font-medium text-purple-700">
                                                            Sent
                                                        </div>
                                                    ) : (
                                                        <div
                                                            onClick={() => handleCellClick(a, activeWeek, i)}
                                                            className={`mx-auto flex h-8 w-11 items-center justify-center rounded border font-medium transition-all
                                                                ${DAY_STYLE[day]}
                                                                ${isClickable ? 'cursor-pointer hover:ring-2 hover:ring-brand-primary/50 hover:ring-offset-1' : ''}
                                                                ${isSwapTarget ? 'ring-2 ring-brand-primary ring-offset-1' : ''}
                                                            `}
                                                        >
                                                            {DAY_LABEL[day]}
                                                        </div>
                                                    )}
                                                </td>
                                            )
                                        })}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                {/* Legend */}
                <div className="flex flex-wrap items-center gap-3 border-t border-surface-border bg-white p-3 text-[11px]">
                    {([
                        ['Working', 'bg-white border border-surface-border'],
                        ['OFF', 'bg-green-100'],
                        ['Paid Leave', 'bg-orange-100'],
                        ['Sick', 'bg-red-100'],
                        ['Training', 'bg-blue-100'],
                        ['Nesting', 'bg-sky-100'],
                        ...(mode === 'agent' ? [['Swap sent', 'bg-purple-100']] : []),
                    ] as [string, string][]).map(([k, c]) => (
                        <div key={k} className="flex items-center gap-1">
                            <div className={`h-3 w-3 rounded border ${c}`} />
                            <span className="text-brand-gray">{k}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Agent mode: Swap Request Panel ──────────────────────────────── */}
            {mode === 'agent' && swapTarget && (
                <div className="rounded-xl border border-brand-primary/30 bg-white p-4 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <ArrowLeftRight size={16} className="text-brand-primary" />
                            <h3 className="text-sm font-semibold">Shift Swap Request</h3>
                        </div>
                        <button type="button" onClick={resetSwap} className="rounded-full p-1 hover:bg-surface-muted">
                            <X size={14} className="text-brand-gray" />
                        </button>
                    </div>

                    {/* Swap summary */}
                    <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs">
                            <p className="text-xs font-medium text-blue-700 mb-1">Your shift — {swapTarget.dayLabel}</p>
                            <p className="font-bold text-blue-900">
                                {SHIFT_FULL[viewerAgent?.weeks[swapTarget.weekIdx][swapTarget.dayIdx] ?? 'E']}
                            </p>
                        </div>
                        <div className="rounded-lg border border-surface-border bg-surface-muted/40 p-3 text-xs">
                            <p className="text-xs font-medium text-brand-gray mb-1">{swapTarget.agentName}&apos;s shift</p>
                            <p className="font-bold">{SHIFT_FULL[swapTarget.dayStatus]}</p>
                        </div>
                    </div>

                    {/* Stage: selecting partner */}
                    {swapFlow.stage === 'selecting' && (
                        <>
                            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-brand-gray">
                                Select a swap partner — same skill, different shift
                            </p>
                            <div className="space-y-2">
                                {partners.map(({ agent, dayStatus, ineligible, reason }) => (
                                    <div
                                        key={agent.id}
                                        className={`flex items-center justify-between rounded-lg border p-2.5 ${
                                            ineligible
                                                ? 'border-surface-border bg-surface-muted/30 opacity-50'
                                                : 'border-surface-border bg-white'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 min-w-0">
                                            <span className="text-xs font-medium truncate">{agent.name}</span>
                                            <Badge variant={agent.skill === 'Voice' ? 'blue' : 'green'}>{agent.skill}</Badge>
                                            <span className={`rounded border px-1.5 py-0.5 text-[10px] font-medium ${DAY_STYLE[dayStatus]}`}>
                                                {DAY_LABEL[dayStatus]}
                                            </span>
                                        </div>
                                        {ineligible ? (
                                            <span className="ml-2 shrink-0 text-[10px] text-brand-gray italic">{reason}</span>
                                        ) : (
                                            <Button size="sm" onClick={() => handleRequestSwap(agent)}>
                                                Request
                                            </Button>
                                        )}
                                    </div>
                                ))}
                                {partners.every((p) => p.ineligible) && (
                                    <p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-700">
                                        No eligible partners available for this shift. All agents are off, on leave, training, or have the same shift type.
                                    </p>
                                )}
                            </div>
                        </>
                    )}

                    {/* Stage: awaiting partner response */}
                    {swapFlow.stage === 'pending' && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-700">
                                <Clock size={14} className="shrink-0" />
                                <p>
                                    Swap request sent to <strong>{swapFlow.partnerName}</strong>. Awaiting their response.
                                    TL will only be involved if the partner accepts.
                                </p>
                            </div>
                            {/* Demo simulation buttons */}
                            <div className="rounded-lg border border-dashed border-surface-border p-3">
                                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-brand-gray">Demo: simulate partner response</p>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handlePartnerAccept(swapFlow.partnerName)}
                                        className="flex items-center gap-1 rounded-lg bg-status-green/10 px-3 py-1.5 text-xs font-medium text-status-green hover:bg-status-green/20"
                                    >
                                        <CheckCircle2 size={12} /> {swapFlow.partnerName} Accepts
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handlePartnerDecline(swapFlow.partnerName)}
                                        className="flex items-center gap-1 rounded-lg bg-status-red/10 px-3 py-1.5 text-xs font-medium text-status-red hover:bg-status-red/20"
                                    >
                                        <X size={12} /> {swapFlow.partnerName} Declines
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Stage: partner declined */}
                    {swapFlow.stage === 'declined' && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 rounded-lg bg-status-red/10 p-3 text-xs text-status-red">
                                <X size={14} className="shrink-0" />
                                <p><strong>{swapFlow.partnerName}</strong> declined. TL has NOT been notified. Select another partner below.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSwapFlow({ stage: 'selecting' })}
                                className="text-xs text-brand-primary underline underline-offset-2 hover:opacity-80"
                            >
                                ← Back to partner selection
                            </button>
                        </div>
                    )}

                    {/* Stage: validating */}
                    {swapFlow.stage === 'validating' && (
                        <div className="space-y-2 rounded-lg bg-surface-muted/40 p-3 text-xs">
                            <p className="font-semibold text-brand-gray">Validating swap…</p>
                            {[
                                '12h minimum rest period between shifts',
                                'Maximum 7 consecutive working days',
                                'Maximum weekly hours limit',
                            ].map((rule) => (
                                <div key={rule} className="flex items-center gap-2 text-status-green">
                                    <CheckCircle2 size={12} className="shrink-0" />
                                    {rule}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Stage: pending TL approval */}
                    {swapFlow.stage === 'pending_tl' && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 rounded-lg bg-status-green/10 p-3 text-xs text-status-green">
                                <CheckCircle2 size={14} className="shrink-0" />
                                <p>
                                    All checks passed. <strong>{swapFlow.partnerName}</strong> accepted.
                                    Swap request sent to <strong>Sarah Chen (Team Lead)</strong> for final approval.
                                </p>
                            </div>
                            <div className="rounded-lg border border-surface-border bg-white p-3 text-xs space-y-1.5">
                                <p className="font-medium">Validation results:</p>
                                <p className="flex items-center gap-1.5 text-status-green"><CheckCircle2 size={11} /> 12h rest: ✓</p>
                                <p className="flex items-center gap-1.5 text-status-green"><CheckCircle2 size={11} /> Max 7 consecutive days: ✓</p>
                                <p className="flex items-center gap-1.5 text-status-green"><CheckCircle2 size={11} /> Max weekly hours: ✓</p>
                                <p className="flex items-center gap-1.5 text-status-green"><CheckCircle2 size={11} /> Skills maintained: ✓</p>
                            </div>
                            <div className="rounded-lg border border-dashed border-surface-border p-3">
                                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-brand-gray">Demo: simulate TL response</p>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => { setSwapFlow({ stage: 'tl_approved' }); toast.success('TL approved the swap!', { description: 'Schedules updated. WFM notified. Payroll adjusted.' }) }}
                                        className="flex items-center gap-1 rounded-lg bg-status-green/10 px-3 py-1.5 text-xs font-medium text-status-green hover:bg-status-green/20"
                                    >
                                        <CheckCircle2 size={12} /> TL Approves
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setSwapFlow({ stage: 'tl_rejected' }); toast.error('TL rejected the swap', { description: 'Original schedules maintained.' }) }}
                                        className="flex items-center gap-1 rounded-lg bg-status-red/10 px-3 py-1.5 text-xs font-medium text-status-red hover:bg-status-red/20"
                                    >
                                        <X size={12} /> TL Rejects
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Stage: TL approved */}
                    {swapFlow.stage === 'tl_approved' && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 rounded-lg bg-status-green/10 p-3 text-sm text-status-green font-medium">
                                <CheckCircle2 size={16} className="shrink-0" />
                                Swap approved by TL Sarah Chen. Schedules updated. WFM notified. Payroll differential adjusted.
                            </div>
                            <button type="button" onClick={resetSwap} className="text-xs text-brand-primary underline underline-offset-2">
                                Request another swap
                            </button>
                        </div>
                    )}

                    {/* Stage: TL rejected */}
                    {swapFlow.stage === 'tl_rejected' && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 rounded-lg bg-status-red/10 p-3 text-xs text-status-red">
                                <AlertCircle size={14} className="shrink-0" />
                                TL rejected the swap. Original schedules are maintained. You can request a different swap below.
                            </div>
                            <button type="button" onClick={resetSwap} className="text-xs text-brand-primary underline underline-offset-2">
                                Try another swap
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* ── TL mode: Pending Swap Card ───────────────────────────────────── */}
            {mode === 'tl' && (
                <div className="overflow-hidden rounded-xl border border-surface-border bg-white">
                    <div className="border-b border-surface-border p-4">
                        <h2 className="text-sm font-semibold">Pending Swap Requests</h2>
                    </div>
                    <div className="p-4">
                        {tlSwapApproved === 'pending' ? (
                            <div className="space-y-3 text-sm">
                                <p><span className="font-medium">Agent #12</span> ↔ <span className="font-medium">Agent #33</span> · Thursday 3/4</p>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="rounded bg-surface-muted p-2">
                                        <p className="text-brand-gray">Agent #12 swaps from</p>
                                        <p className="font-medium">Early 07:00–15:00</p>
                                    </div>
                                    <div className="rounded bg-surface-muted p-2">
                                        <p className="text-brand-gray">Agent #33 swaps from</p>
                                        <p className="font-medium">Mid 10:00–18:00</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    <Badge variant="green">Compliance: passed</Badge>
                                    <Badge variant="green">Skills: maintained</Badge>
                                    <Badge variant="green">Agent #33: accepted</Badge>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" onClick={() => { setTlSwapApproved('approved'); toast.success('Swap approved', { description: 'Both agents notified. Schedules updated. WFM recalculated.' }) }}>
                                        <CheckCircle2 size={13} /> Approve
                                    </Button>
                                    <Button size="sm" variant="ghost" onClick={() => { setTlSwapApproved('declined'); toast.info('Swap declined. Agents notified.') }}>
                                        Decline
                                    </Button>
                                </div>
                            </div>
                        ) : tlSwapApproved === 'approved' ? (
                            <div className="flex items-center gap-2 rounded-lg bg-status-green/10 p-3 text-sm text-status-green">
                                <CheckCircle2 size={14} className="shrink-0" />
                                Swap approved. Agent #12 and Agent #33 Thursday schedules swapped. Payroll adjusted.
                            </div>
                        ) : (
                            <div className="rounded-lg bg-surface-muted/40 p-3 text-sm text-brand-gray">
                                Swap declined. Agents notified. No changes to schedule.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
