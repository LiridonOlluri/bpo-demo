'use client'

import { useState, useMemo } from 'react'
import { toast } from 'sonner'
import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import {
    CheckCircle2, X, AlertCircle, Info, ArrowLeftRight,
    Clock, CalendarRange, AlertTriangle,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────
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

// ─── Schedule data ─────────────────────────────────────────────────────────────
// NOTE: Agent #12 Week 1 Thu (idx 3) = E to match UC-1C: #12 Early ↔ #33 Mid
export const DAYS_W1 = ['Mon\n31/3', 'Tue\n1/4', 'Wed\n2/4', 'Thu\n3/4', 'Fri\n4/4', 'Sat\n5/4', 'Sun\n6/4']
export const DAYS_W2 = ['Mon\n7/4', 'Tue\n8/4', 'Wed\n9/4', 'Thu\n10/4', 'Fri\n11/4', 'Sat\n12/4', 'Sun\n13/4']
export const DAYS_W3 = ['Mon\n14/4', 'Tue\n15/4', 'Wed\n16/4', 'Thu\n17/4', 'Fri\n18/4', 'Sat\n19/4', 'Sun\n20/4']
export const ALL_WEEK_DAYS = [DAYS_W1, DAYS_W2, DAYS_W3]
const WEEK_LABELS = ['Week 1 (31 Mar–6 Apr)', 'Week 2 (7–13 Apr)', 'Week 3 (14–20 Apr)']
const WEEK_SHORT  = ['Week 1', 'Week 2', 'Week 3']

export const SCHEDULE_AGENTS: ScheduleAgent[] = [
    { id: '#12',   name: 'Agent #12',    skill: 'Voice', status: 'FT', shiftStart: '07:00', shiftEnd: '15:00', weeks: [['E','E','E','E','E','OFF','OFF'], ['E','E','E','E','E','OFF','OFF'],    ['E','E','OFF','E','E','E','OFF']]  },
    { id: '#7',    name: 'Agent #7',     skill: 'Voice', status: 'FT', shiftStart: '10:00', shiftEnd: '18:00', weeks: [['M','M','M','M','OFF','OFF','M'], ['M','OFF','M','M','M','M','OFF'],    ['OFF','M','M','M','OFF','M','M']] },
    { id: '#22',   name: 'Agent #22',    skill: 'Voice', status: 'FT', shiftStart: '07:00', shiftEnd: '15:00', weeks: [['E','E','OFF','E','E','OFF','OFF'],['E','E','E','E','OFF','OFF','E'],    ['E','E','E','OFF','E','E','OFF']] },
    { id: '#28',   name: 'Agent #28',    skill: 'Voice', status: 'FT', shiftStart: '16:00', shiftEnd: '00:00', weeks: [['L','L','OFF','L','L','OFF','OFF'],['L','OFF','L','L','L','L','OFF'],    ['L','L','L','OFF','OFF','L','L']] },
    { id: '#33',   name: 'Agent #33',    skill: 'Voice', status: 'FT', shiftStart: '10:00', shiftEnd: '18:00', weeks: [['M','M','M','M','M','OFF','OFF'],  ['OFF','M','M','M','M','M','OFF'],    ['M','M','OFF','M','M','OFF','M']] },
    { id: 'alice', name: 'Alice Monroe', skill: 'Voice', status: 'FT', shiftStart: '07:00', shiftEnd: '15:00', weeks: [['E','E','E','OFF','E','E','OFF'],  ['E','E','OFF','E','E','E','OFF'],    ['OFF','E','E','E','E','OFF','E']] },
    { id: 'ella',  name: 'Ella Brooks',  skill: 'Voice', status: 'FT', shiftStart: '07:00', shiftEnd: '15:00', weeks: [['E','OFF','E','E','E','OFF','OFF'],['E','E','E','OFF','E','E','OFF'],    ['E','E','E','E','OFF','OFF','E']] },
    { id: 'frank', name: 'Frank Osei',   skill: 'Chat',  status: 'FT', shiftStart: '10:00', shiftEnd: '18:00', weeks: [['M','M','OFF','M','M','OFF','M'],  ['M','M','M','M','OFF','OFF','M'],    ['M','OFF','M','M','M','M','OFF']] },
    { id: 'grace', name: 'Grace Kim',    skill: 'Chat',  status: 'FT', shiftStart: '10:00', shiftEnd: '18:00', weeks: [['M','TR','TR','TR','M','OFF','OFF'],['M','M','OFF','M','M','M','OFF'],    ['OFF','M','M','M','M','OFF','M']] },
    { id: 'ryan',  name: 'Ryan Costa',   skill: 'Voice', status: 'FT', shiftStart: '07:00', shiftEnd: '15:00', weeks: [['SL','E','E','E','OFF','OFF','E'], ['E','E','E','OFF','E','E','OFF'],    ['E','E','OFF','E','E','E','OFF']] },
]

// ─── Display helpers ──────────────────────────────────────────────────────────
export const DAY_STYLE: Record<DayStatus, string> = {
    E:   'bg-white border-surface-border',
    M:   'bg-white border-surface-border',
    L:   'bg-white border-surface-border',
    OFF: 'bg-green-100 border-green-200 text-green-700',
    PL:  'bg-orange-100 border-orange-200 text-orange-700',
    SL:  'bg-red-100 border-red-200 text-red-700',
    TR:  'bg-blue-100 border-blue-200 text-blue-700',
    NE:  'bg-sky-100 border-sky-200 text-sky-700',
    OVR: 'bg-yellow-50 border-yellow-300 text-yellow-700',
}
export const DAY_LABEL: Record<DayStatus, string> = {
    E: '07-15', M: '10-18', L: '16-00', OFF: 'OFF', PL: 'P/L', SL: 'Sick', TR: 'Train', NE: 'Nest', OVR: 'OVR',
}
const SHIFT_FULL: Record<DayStatus, string> = {
    E: 'Early 07:00–15:00', M: 'Mid 10:00–18:00', L: 'Late 16:00–00:00',
    OFF: 'Day Off', PL: 'Paid Leave', SL: 'Sick Leave', TR: 'Training', NE: 'Nesting', OVR: 'Overtime',
}
export const IS_WORKING: Record<DayStatus, boolean> = {
    E: true, M: true, L: true, OVR: true,
    OFF: false, PL: false, SL: false, TR: false, NE: false,
}

// ─── Validation helpers ───────────────────────────────────────────────────────
// Returns false (fail) if end of 'prev' + start of 'next' < 12h rest
function check12hRest(prev: DayStatus, next: DayStatus): boolean {
    if (!IS_WORKING[prev] || !IS_WORKING[next]) return true
    // Late ends 00:00; Early starts 07:00 (7h) or Mid starts 10:00 (10h) → both fail
    if (prev === 'L' && (next === 'E' || next === 'M')) return false
    return true
}

interface ValidationCheck { rule: string; pass: boolean; detail: string }

function computeValidation(
    viewer: ScheduleAgent,
    target: ScheduleAgent,
    weekIdx: number,
    dayIndices: number[],  // empty = full week swap; [-1] = off-day swap indicator handled separately
    fullWeek: boolean,
    offDayMode: boolean,
    offDayIdx: number | null,
): ValidationCheck[] {
    // Build new schedules post-swap
    const vNew = [...viewer.weeks[weekIdx]]
    const tNew = [...target.weeks[weekIdx]]

    if (fullWeek) {
        for (let d = 0; d < 7; d++) {
            vNew[d] = target.weeks[weekIdx][d]
            tNew[d] = viewer.weeks[weekIdx][d]
        }
    } else if (offDayMode && offDayIdx !== null) {
        // Agent works partner's shift, partner gets OFF
        vNew[offDayIdx] = target.weeks[weekIdx][offDayIdx]
        tNew[offDayIdx] = 'OFF'
    } else {
        for (const d of dayIndices) {
            vNew[d] = target.weeks[weekIdx][d]
            tNew[d] = viewer.weeks[weekIdx][d]
        }
    }

    // 12h rest
    let restPass = true; let restDetail = ''
    for (let d = 0; d < 6; d++) {
        if (!check12hRest(vNew[d], vNew[d + 1])) {
            restPass = false
            restDetail = `${viewer.name}: ${DAY_LABEL[vNew[d]]} → ${DAY_LABEL[vNew[d + 1]]} (${7}h rest — below 12h minimum)`
            break
        }
        if (!check12hRest(tNew[d], tNew[d + 1])) {
            restPass = false
            restDetail = `${target.name}: ${DAY_LABEL[tNew[d]]} → ${DAY_LABEL[tNew[d + 1]]} (insufficient rest after swap)`
            break
        }
    }

    // Max 7 consecutive
    let maxC = 0; let curC = 0
    for (const d of vNew) { IS_WORKING[d] ? (curC++, maxC = Math.max(maxC, curC)) : (curC = 0) }

    // Weekly hours
    const vHours = vNew.reduce((s, d) => s + (IS_WORKING[d] ? 8 : 0), 0)

    const skillMatch = viewer.skill === target.skill

    return [
        {
            rule: '12h minimum rest between shifts',
            pass: restPass,
            detail: restPass ? 'All adjacent shifts maintain ≥12h rest' : restDetail,
        },
        {
            rule: 'Max 7 consecutive working days',
            pass: maxC <= 7,
            detail: maxC > 7 ? `${viewer.name} would work ${maxC} consecutive days` : `${maxC} consecutive days max — within limit`,
        },
        {
            rule: 'Max weekly hours (48h)',
            pass: vHours <= 48,
            detail: vHours > 48 ? `${viewer.name}: ${vHours}h — exceeds 48h limit` : `${vHours}h this week — within 48h limit`,
        },
        {
            rule: 'Same project (Client A)',
            pass: true,
            detail: 'Both agents assigned to Client A',
        },
        {
            rule: `Same skill requirement`,
            pass: skillMatch,
            detail: skillMatch
                ? `Both ${viewer.skill} — skill coverage maintained`
                : `${viewer.skill} ↔ ${target.skill} — skill mismatch, Client SLA may be affected`,
        },
    ]
}

// ─── Swap-mode types ──────────────────────────────────────────────────────────
type SwapMode = 'single' | 'multi' | 'full_week' | 'off_day'

interface CellSelection {
    targetAgentId: string | null   // null while in off_day mode before choosing partner
    weekIdx: number
    dayIndices: number[]           // selected day indices on target agent's row
    fullWeek: boolean
    offDayMode: boolean            // true when viewer clicked their own OFF cell
    offDayIdx: number | null       // which day index is the viewer's OFF cell
}

const EMPTY_SEL: CellSelection = {
    targetAgentId: null, weekIdx: 0, dayIndices: [],
    fullWeek: false, offDayMode: false, offDayIdx: null,
}

type SwapFlow =
    | { stage: 'pre_submit' }
    | { stage: 'pending_partner'; partnerName: string }
    | { stage: 'declined';        partnerName: string }
    | { stage: 'pending_tl';      partnerName: string; swapMode: SwapMode }
    | { stage: 'tl_approved' }
    | { stage: 'tl_rejected' }

// ─── TL pending swap data ─────────────────────────────────────────────────────
type TlPendingSingle = {
    id: string; mode: Exclude<SwapMode, 'full_week'>; modeLabel: string
    initiator: string; partner: string; days: string
    before: { initiator: string; partner: string }
    badges: string[]
}
type TlPendingWeek = {
    id: string; mode: 'full_week'; modeLabel: string
    initiator: string; partner: string; days: string
    beforeGrid: { initiator: DayStatus[]; partner: DayStatus[] }
    afterGrid:  { initiator: DayStatus[]; partner: DayStatus[] }
    badges: string[]
}
type TlPending = TlPendingSingle | TlPendingWeek

const TL_PENDING: TlPending[] = [
    {
        id: 'tl-1',
        mode: 'single',
        modeLabel: 'Single Day Swap',
        initiator: 'Agent #12', partner: 'Agent #33',
        days: 'Thursday 3/4',
        before: { initiator: 'Early 07:00–15:00', partner: 'Mid 10:00–18:00' },
        badges: ['Compliance: passed', 'Skills: Voice ↔ Voice', 'Agent #33: accepted'],
    },
    {
        id: 'tl-2',
        mode: 'full_week',
        modeLabel: 'Full Week Swap — Week 2 (7–13 Apr)',
        initiator: 'Agent #12', partner: 'Agent #33',
        days: 'All working days, Week 2',
        beforeGrid: {
            initiator: ['E','E','E','E','E','OFF','OFF'] as DayStatus[],
            partner:   ['OFF','M','M','M','M','M','OFF'] as DayStatus[],
        },
        afterGrid: {
            initiator: ['OFF','M','M','M','M','M','OFF'] as DayStatus[],
            partner:   ['E','E','E','E','E','OFF','OFF'] as DayStatus[],
        },
        badges: ['Compliance: passed', 'Skills: Voice ↔ Voice', '40h/week each', 'Agent #33: accepted'],
    },
]

// ─── Props ────────────────────────────────────────────────────────────────────
interface TeamScheduleGridProps {
    mode: 'agent' | 'tl'
    viewerAgentId?: string
}

// ─── Small cell pill ──────────────────────────────────────────────────────────
function DayPill({ status, size = 'md' }: { status: DayStatus; size?: 'sm' | 'md' }) {
    const h = size === 'sm' ? 'h-6 w-9 text-[9px]' : 'h-8 w-11 text-[10px]'
    return (
        <div className={`mx-auto flex items-center justify-center rounded border font-medium ${h} ${DAY_STYLE[status]}`}>
            {DAY_LABEL[status]}
        </div>
    )
}

// ─── Main component ───────────────────────────────────────────────────────────
export function TeamScheduleGrid({ mode, viewerAgentId = '#12' }: TeamScheduleGridProps) {
    const [activeWeek, setActiveWeek] = useState(0)
    const weekDays = ALL_WEEK_DAYS[activeWeek]

    // Agent mode state
    const [sel, setSel] = useState<CellSelection>(EMPTY_SEL)
    const [flow, setFlow] = useState<SwapFlow>({ stage: 'pre_submit' })
    const [submittedCells, setSubmittedCells] = useState<Set<string>>(new Set())

    // TL mode state
    const [tlStatus, setTlStatus] = useState<Record<string, 'pending' | 'approved' | 'declined'>>({
        'tl-1': 'pending', 'tl-2': 'pending',
    })

    const viewerAgent = SCHEDULE_AGENTS.find((a) => a.id === viewerAgentId)!
    const targetAgent = SCHEDULE_AGENTS.find((a) => a.id === sel.targetAgentId) ?? null

    // Derived swap mode
    const swapMode = useMemo((): SwapMode | null => {
        if (!sel.offDayMode && !sel.fullWeek && sel.dayIndices.length === 0) return null
        if (sel.offDayMode)             return 'off_day'
        if (sel.fullWeek)               return 'full_week'
        if (sel.dayIndices.length === 1) return 'single'
        return 'multi'
    }, [sel])

    // Show panel when something is selected
    const showPanel = swapMode !== null && (
        sel.targetAgentId !== null ||
        (sel.offDayMode && sel.offDayIdx !== null)
    )

    // Pre-validation (runs any time panel is visible and we have both parties)
    const validation = useMemo((): ValidationCheck[] => {
        if (!targetAgent || !viewerAgent) return []
        if (sel.offDayMode && sel.offDayIdx === null) return []
        return computeValidation(
            viewerAgent, targetAgent,
            sel.weekIdx, sel.dayIndices,
            sel.fullWeek, sel.offDayMode, sel.offDayIdx ?? null,
        )
    }, [viewerAgent, targetAgent, sel])

    const allPass = validation.length > 0 && validation.every((c) => c.pass)

    // ── Cell click handlers ──
    const handleAgentCellClick = (agent: ScheduleAgent, weekIdx: number, dayIdx: number) => {
        if (mode !== 'agent') return
        const isViewer = agent.id === viewerAgentId
        const day = agent.weeks[weekIdx][dayIdx]

        // Click on own OFF day → start OFF Day Swap mode
        if (isViewer && day === 'OFF') {
            setSel({ targetAgentId: null, weekIdx, dayIndices: [], fullWeek: false, offDayMode: true, offDayIdx: dayIdx })
            setFlow({ stage: 'pre_submit' })
            return
        }
        if (isViewer) return  // own working day — no action

        // In off_day mode: clicking another agent completes partner selection
        if (sel.offDayMode && sel.offDayIdx !== null) {
            if (!IS_WORKING[day]) return  // partner must be working that day
            setSel((prev) => ({ ...prev, targetAgentId: agent.id }))
            setFlow({ stage: 'pre_submit' })
            return
        }

        if (!IS_WORKING[day]) return  // non-viewer, non-working cell = skip

        if (sel.targetAgentId === agent.id && sel.weekIdx === weekIdx) {
            // Same agent row: toggle this day
            const next = sel.dayIndices.includes(dayIdx)
                ? sel.dayIndices.filter((d) => d !== dayIdx)
                : [...sel.dayIndices, dayIdx].sort((a, b) => a - b)
            if (next.length === 0) {
                setSel(EMPTY_SEL)
            } else {
                setSel((prev) => ({ ...prev, dayIndices: next }))
            }
        } else {
            // Different agent: start fresh selection
            setSel({ targetAgentId: agent.id, weekIdx, dayIndices: [dayIdx], fullWeek: false, offDayMode: false, offDayIdx: null })
        }
        setFlow({ stage: 'pre_submit' })
    }

    const handleFullWeekBtn = (agent: ScheduleAgent) => {
        if (mode !== 'agent' || agent.id === viewerAgentId) return
        setSel({ targetAgentId: agent.id, weekIdx: activeWeek, dayIndices: [], fullWeek: true, offDayMode: false, offDayIdx: null })
        setFlow({ stage: 'pre_submit' })
    }

    const handleSubmit = () => {
        if (!targetAgent) return
        setFlow({ stage: 'pending_partner', partnerName: targetAgent.name })
    }

    const handlePartnerAccept = (partnerName: string) => {
        const mode_ = swapMode!
        setTimeout(() => {
            setFlow({ stage: 'pending_tl', partnerName, swapMode: mode_ })
            // Mark cells as submitted
            if (sel.fullWeek) {
                const keys = sel.dayIndices.length > 0
                    ? sel.dayIndices.map((d) => `${sel.targetAgentId}-w${sel.weekIdx}-d${d}`)
                    : Array.from({ length: 7 }, (_, d) => `${sel.targetAgentId}-w${sel.weekIdx}-d${d}`)
                setSubmittedCells((p) => new Set([...p, ...keys]))
            } else if (sel.offDayMode && sel.offDayIdx !== null) {
                setSubmittedCells((p) => new Set([...p, `${sel.targetAgentId}-w${sel.weekIdx}-d${sel.offDayIdx}`]))
            } else {
                const keys = sel.dayIndices.map((d) => `${sel.targetAgentId}-w${sel.weekIdx}-d${d}`)
                setSubmittedCells((p) => new Set([...p, ...keys]))
            }
            toast.success('Partner accepted — TL notified', {
                description: `Sarah Chen has received the ${swapModeLabel(mode_)} request. Awaiting approval.`,
            })
        }, 900)
    }

    const handlePartnerDecline = (partnerName: string) => {
        setFlow({ stage: 'declined', partnerName })
        toast.error(`${partnerName} declined`, { description: 'TL is not notified for declined requests.' })
    }

    const handleTlApprove = () => {
        setFlow({ stage: 'tl_approved' })
        toast.success('TL approved the swap!', { description: 'Schedules updated. WFM notified. Payroll differential adjusted.' })
    }
    const handleTlReject = () => {
        setFlow({ stage: 'tl_rejected' })
        toast.error('TL rejected the swap', { description: 'Original schedules maintained.' })
    }

    const resetSel = () => { setSel(EMPTY_SEL); setFlow({ stage: 'pre_submit' }) }

    // ── Build before/after preview ──
    const buildPreview = () => {
        if (!targetAgent) return null
        const vBefore: DayStatus[] = [], vAfter: DayStatus[] = []
        const tBefore: DayStatus[] = [], tAfter: DayStatus[] = []
        const days: string[] = []

        const wk = sel.weekIdx
        const allDays = ALL_WEEK_DAYS[wk]

        if (sel.fullWeek) {
            for (let d = 0; d < 7; d++) {
                vBefore.push(viewerAgent.weeks[wk][d])
                tBefore.push(targetAgent.weeks[wk][d])
                vAfter.push(targetAgent.weeks[wk][d])
                tAfter.push(viewerAgent.weeks[wk][d])
                days.push(allDays[d].replace('\n', ' '))
            }
        } else if (sel.offDayMode && sel.offDayIdx !== null) {
            const d = sel.offDayIdx
            vBefore.push(viewerAgent.weeks[wk][d])    // OFF
            tBefore.push(targetAgent.weeks[wk][d])    // working
            vAfter.push(targetAgent.weeks[wk][d])     // now working
            tAfter.push('OFF')                         // partner gets OFF
            days.push(allDays[d].replace('\n', ' '))
        } else {
            for (const d of sel.dayIndices) {
                vBefore.push(viewerAgent.weeks[wk][d])
                tBefore.push(targetAgent.weeks[wk][d])
                vAfter.push(targetAgent.weeks[wk][d])
                tAfter.push(viewerAgent.weeks[wk][d])
                days.push(allDays[d].replace('\n', ' '))
            }
        }
        return { vBefore, vAfter, tBefore, tAfter, days }
    }

    const preview = buildPreview()

    // ── Eligible partners list (for OFF Day mode partner selection) ──
    const offDayPartners = useMemo(() => {
        if (!sel.offDayMode || sel.offDayIdx === null) return []
        return SCHEDULE_AGENTS
            .filter((a) => a.id !== viewerAgentId)
            .map((a) => {
                const day = a.weeks[sel.weekIdx][sel.offDayIdx!]
                const working = IS_WORKING[day]
                const skillOk = a.skill === viewerAgent.skill
                return { agent: a, day, eligible: working && skillOk, reason: !working ? 'Not working that day' : !skillOk ? `Skill: ${a.skill}` : null }
            })
    }, [sel.offDayMode, sel.offDayIdx, sel.weekIdx, viewerAgentId, viewerAgent.skill])

    return (
        <div className="space-y-4">
            {/* Instruction banner */}
            {mode === 'agent' && (
                <div className="flex items-start gap-2 rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs text-blue-700">
                    <Info size={14} className="mt-0.5 shrink-0" />
                    <div>
                        <strong>Your row is highlighted blue.</strong>
                        {' '}Click a team member&apos;s working cell to request a swap.
                        Click multiple cells on the same row for a <strong>multi-day swap</strong>.
                        Click the <strong>&quot;↔ Wk&quot;</strong> button on any row for a <strong>full-week swap</strong>.
                        Click your own <strong>OFF cell</strong> to request an <strong>OFF-day swap</strong>.
                    </div>
                </div>
            )}
            {mode === 'tl' && (
                <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
                    <Info size={14} className="mt-0.5 shrink-0" />
                    <p>TL view — <strong>view</strong> only + <strong>approve swap requests</strong> below. Schedule generation/publication is WFM Manager (Level 4) authority.</p>
                </div>
            )}

            {/* ── 3-week grid ── */}
            <div className="overflow-hidden rounded-xl border border-surface-border">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-surface-border bg-white p-4">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-gray">3-Week Schedule Grid</h2>
                    <div className="flex flex-wrap gap-1">
                        {WEEK_LABELS.map((w, i) => (
                            <button key={i} type="button" onClick={() => { setActiveWeek(i); resetSel() }}
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
                                <th className="sticky left-0 z-10 bg-surface-muted/60 p-2 text-left font-medium text-brand-gray w-[130px]">Agent</th>
                                <th className="p-2 text-left font-medium text-brand-gray">Skill</th>
                                <th className="p-2 text-left font-medium text-brand-gray">Shift</th>
                                {weekDays.map((d, i) => (
                                    <th key={i} className="p-2 text-center font-medium text-brand-gray min-w-[52px] whitespace-pre-line leading-tight">{d}</th>
                                ))}
                                {mode === 'agent' && <th className="p-2 text-center font-medium text-brand-gray w-[48px]">Wk</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {SCHEDULE_AGENTS.map((a) => {
                                const isViewer = mode === 'agent' && a.id === viewerAgentId
                                const isTargetRow = sel.targetAgentId === a.id && sel.weekIdx === activeWeek
                                return (
                                    <tr key={a.id} className={`border-b border-surface-border last:border-0 ${
                                        isViewer ? 'bg-blue-50/60' : isTargetRow ? 'bg-violet-50/40' : 'hover:bg-surface-muted/20'
                                    }`}>
                                        {/* Agent name */}
                                        <td className={`sticky left-0 z-10 p-2 font-medium ${isViewer ? 'bg-blue-50/80' : isTargetRow ? 'bg-violet-50/60' : 'bg-white'}`}>
                                            <span className="flex items-center gap-1 flex-wrap">
                                                {a.name}
                                                {isViewer && <span className="rounded-full bg-blue-200 px-1.5 py-0.5 text-[9px] font-bold text-blue-700">You</span>}
                                            </span>
                                        </td>
                                        <td className="p-2">
                                            <Badge variant={a.skill === 'Voice' ? 'blue' : 'green'}>{a.skill}</Badge>
                                        </td>
                                        <td className="p-2 text-brand-gray">{a.shiftStart}–{a.shiftEnd}</td>
                                        {a.weeks[activeWeek].map((day, i) => {
                                            const cellKey = `${a.id}-w${activeWeek}-d${i}`
                                            const isSubmitted = submittedCells.has(cellKey)
                                            const isSelected = (
                                                (isTargetRow && sel.dayIndices.includes(i)) ||
                                                (sel.fullWeek && isTargetRow)
                                            )
                                            // Clickability
                                            const isOwnOFF = isViewer && day === 'OFF'
                                            const isOtherWorking = !isViewer && IS_WORKING[day]
                                            const isOtherOffDayTarget = sel.offDayMode && !isViewer && sel.offDayIdx !== null && IS_WORKING[day] && i === sel.offDayIdx
                                            const clickable = mode === 'agent' && (isOwnOFF || isOtherWorking)
                                            return (
                                                <td key={i} className="p-1 text-center">
                                                    {isSubmitted ? (
                                                        <div className="mx-auto flex h-8 w-11 items-center justify-center rounded border border-purple-200 bg-purple-100 text-[9px] font-medium text-purple-700">Sent</div>
                                                    ) : (
                                                        <div
                                                            onClick={() => handleAgentCellClick(a, activeWeek, i)}
                                                            title={clickable ? (isOwnOFF ? 'Click to request OFF-day swap' : 'Click to select for swap') : undefined}
                                                            className={`mx-auto flex h-8 w-11 items-center justify-center rounded border font-medium text-[10px] transition-all
                                                                ${DAY_STYLE[day]}
                                                                ${clickable ? 'cursor-pointer hover:ring-2 hover:ring-brand-primary/40 hover:ring-offset-1' : ''}
                                                                ${isSelected ? 'ring-2 ring-brand-primary ring-offset-1 shadow-sm' : ''}
                                                                ${isOwnOFF && sel.offDayMode && sel.offDayIdx === i ? 'ring-2 ring-orange-400 ring-offset-1' : ''}
                                                                ${isOtherOffDayTarget ? 'ring-2 ring-orange-400/60 ring-offset-1' : ''}
                                                            `}
                                                        >
                                                            {DAY_LABEL[day]}
                                                        </div>
                                                    )}
                                                </td>
                                            )
                                        })}
                                        {/* Full-week swap button (agent mode only, non-viewer rows) */}
                                        {mode === 'agent' && (
                                            <td className="p-1 text-center">
                                                {!isViewer && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleFullWeekBtn(a)}
                                                        title={`Swap entire ${WEEK_SHORT[activeWeek]} with ${a.name}`}
                                                        className={`flex h-8 w-10 items-center justify-center rounded border text-[10px] font-medium transition-all mx-auto
                                                            ${sel.fullWeek && sel.targetAgentId === a.id && sel.weekIdx === activeWeek
                                                                ? 'border-brand-primary bg-brand-primary/10 text-brand-primary ring-1 ring-brand-primary'
                                                                : 'border-surface-border text-brand-gray hover:border-brand-primary/50 hover:bg-brand-primary/5 hover:text-brand-primary'
                                                            }`}
                                                    >
                                                        ↔Wk
                                                    </button>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                {/* Legend */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-surface-border bg-white p-3 text-[11px]">
                    {([
                        ['Working', 'bg-white border border-surface-border'],
                        ['OFF', 'bg-green-100 border border-green-200'],
                        ['Paid Leave', 'bg-orange-100 border border-orange-200'],
                        ['Sick', 'bg-red-100 border border-red-200'],
                        ['Training', 'bg-blue-100 border border-blue-200'],
                        ['Nesting', 'bg-sky-100 border border-sky-200'],
                        ...(mode === 'agent' ? [
                            ['Selected', 'bg-white border-2 border-brand-primary'],
                            ['Swap sent', 'bg-purple-100 border border-purple-200'],
                        ] : []),
                    ] as [string, string][]).map(([k, c]) => (
                        <div key={k} className="flex items-center gap-1">
                            <div className={`h-3 w-3 rounded ${c}`} />
                            <span className="text-brand-gray">{k}</span>
                        </div>
                    ))}
                    {mode === 'agent' && <span className="text-brand-gray">· &quot;↔Wk&quot; button = full-week swap · click your own <span className="text-green-700 font-medium">OFF</span> cell = OFF-day swap</span>}
                </div>
            </div>

            {/* ══ AGENT MODE: Swap Panel ══════════════════════════════════════════ */}
            {mode === 'agent' && (
                <>
                    {/* OFF Day: choose partner (before target is selected) */}
                    {sel.offDayMode && sel.offDayIdx !== null && !sel.targetAgentId && (
                        <OffDayPartnerPicker
                            offDayLabel={ALL_WEEK_DAYS[sel.weekIdx][sel.offDayIdx].replace('\n', ' ')}
                            partners={offDayPartners}
                            viewerAgent={viewerAgent}
                            onSelect={(agentId) => setSel((p) => ({ ...p, targetAgentId: agentId }))}
                            onCancel={resetSel}
                        />
                    )}

                    {/* Main swap panel (when we have a target) */}
                    {showPanel && targetAgent && flow.stage !== 'tl_approved' && flow.stage !== 'tl_rejected' && (
                        <SwapPanel
                            swapMode={swapMode!}
                            weekIdx={sel.weekIdx}
                            viewerAgent={viewerAgent}
                            targetAgent={targetAgent}
                            preview={preview}
                            validation={validation}
                            allPass={allPass}
                            flow={flow}
                            onSubmit={handleSubmit}
                            onPartnerAccept={handlePartnerAccept}
                            onPartnerDecline={handlePartnerDecline}
                            onTlApprove={handleTlApprove}
                            onTlReject={handleTlReject}
                            onBackToPartner={() => setFlow({ stage: 'pre_submit' })}
                            onReset={resetSel}
                        />
                    )}

                    {flow.stage === 'tl_approved' && (
                        <div className="flex flex-col gap-2 rounded-xl border border-status-green/30 bg-status-green/5 p-4">
                            <div className="flex items-center gap-2 text-sm font-medium text-status-green">
                                <CheckCircle2 size={16} className="shrink-0" />
                                Swap approved by TL Sarah Chen. Schedules updated. WFM notified. Payroll differential adjusted.
                            </div>
                            <button type="button" onClick={resetSel} className="self-start text-xs text-brand-primary underline underline-offset-2">Request another swap</button>
                        </div>
                    )}
                    {flow.stage === 'tl_rejected' && (
                        <div className="flex flex-col gap-2 rounded-xl border border-status-red/30 bg-status-red/5 p-4">
                            <div className="flex items-center gap-2 text-xs text-status-red">
                                <AlertCircle size={14} className="shrink-0" />
                                TL rejected the swap. Original schedules maintained. You can request a different swap.
                            </div>
                            <button type="button" onClick={resetSel} className="self-start text-xs text-brand-primary underline underline-offset-2">Try another swap</button>
                        </div>
                    )}
                </>
            )}

            {/* ══ TL MODE: Pending Requests ══════════════════════════════════════ */}
            {mode === 'tl' && (
                <div className="overflow-hidden rounded-xl border border-surface-border bg-white">
                    <div className="border-b border-surface-border px-4 py-3">
                        <h2 className="text-sm font-semibold">Pending Swap Requests</h2>
                    </div>
                    <div className="divide-y divide-surface-border">
                        {TL_PENDING.map((req) => (
                            <TlSwapCard
                                key={req.id}
                                req={req}
                                status={tlStatus[req.id]}
                                onApprove={() => {
                                    setTlStatus((p) => ({ ...p, [req.id]: 'approved' }))
                                    toast.success(`Swap approved — ${req.modeLabel}`, { description: 'Both agents notified. WFM recalculated.' })
                                }}
                                onDecline={() => {
                                    setTlStatus((p) => ({ ...p, [req.id]: 'declined' }))
                                    toast.info('Swap declined. Agents notified.')
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

// ─── Off-Day Partner Picker ───────────────────────────────────────────────────
function OffDayPartnerPicker({
    offDayLabel, partners, viewerAgent, onSelect, onCancel,
}: {
    offDayLabel: string
    partners: { agent: ScheduleAgent; day: DayStatus; eligible: boolean; reason: string | null }[]
    viewerAgent: ScheduleAgent
    onSelect: (id: string) => void
    onCancel: () => void
}) {
    return (
        <div className="rounded-xl border border-orange-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <CalendarRange size={15} className="text-orange-500" />
                    <h3 className="text-sm font-semibold">OFF Day Swap — {offDayLabel}</h3>
                </div>
                <button type="button" onClick={onCancel} className="rounded-full p-1 hover:bg-surface-muted"><X size={13} className="text-brand-gray" /></button>
            </div>
            <p className="mb-3 text-xs text-brand-gray">
                You are <strong>off</strong> on {offDayLabel}. Select a partner who is working that day.
                They will take your OFF day; you will work their shift.
            </p>
            <div className="space-y-1.5">
                {partners.map(({ agent, day, eligible, reason }) => (
                    <div key={agent.id} className={`flex items-center justify-between rounded-lg border p-2.5 ${eligible ? 'border-surface-border bg-white' : 'border-surface-border bg-surface-muted/30 opacity-50'}`}>
                        <div className="flex items-center gap-2 min-w-0">
                            <span className="text-xs font-medium truncate">{agent.name}</span>
                            <Badge variant={agent.skill === 'Voice' ? 'blue' : 'green'}>{agent.skill}</Badge>
                            <DayPill status={day} size="sm" />
                        </div>
                        {eligible
                            ? <Button size="sm" onClick={() => onSelect(agent.id)}>Select</Button>
                            : <span className="ml-2 shrink-0 text-[10px] italic text-brand-gray">{reason}</span>
                        }
                    </div>
                ))}
            </div>
        </div>
    )
}

// ─── Mode label helper ────────────────────────────────────────────────────────
function swapModeLabel(mode: SwapMode, weekIdx?: number, dayCount?: number): string {
    if (mode === 'single')    return 'Single Day Swap'
    if (mode === 'off_day')   return 'OFF Day Swap'
    if (mode === 'full_week') return `Full Week Swap${weekIdx !== undefined ? ` — ${WEEK_SHORT[weekIdx]}` : ''}`
    return `Multiple Days Swap (${dayCount ?? '?'} days)`
}

const MODE_COLOR: Record<SwapMode, string> = {
    single:    'border-blue-200 bg-blue-50 text-blue-700',
    multi:     'border-violet-200 bg-violet-50 text-violet-700',
    full_week: 'border-green-200 bg-green-50 text-green-700',
    off_day:   'border-orange-200 bg-orange-50 text-orange-700',
}

// ─── Main swap panel (pre-submit → pending partner → pending TL) ──────────────
function SwapPanel({
    swapMode, weekIdx, viewerAgent, targetAgent,
    preview, validation, allPass, flow,
    onSubmit, onPartnerAccept, onPartnerDecline, onTlApprove, onTlReject, onBackToPartner, onReset,
}: {
    swapMode: SwapMode
    weekIdx: number
    viewerAgent: ScheduleAgent
    targetAgent: ScheduleAgent
    preview: PreviewData | null
    validation: ValidationCheck[]
    allPass: boolean
    flow: SwapFlow
    onSubmit: () => void
    onPartnerAccept: (name: string) => void
    onPartnerDecline: (name: string) => void
    onTlApprove: () => void
    onTlReject: () => void
    onBackToPartner: () => void
    onReset: () => void
}) {
    const modeLabel = swapModeLabel(swapMode, weekIdx, preview?.days.length)

    return (
        <div className="rounded-xl border border-surface-border bg-white shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-surface-border p-4">
                <div className="flex items-center gap-2.5">
                    <ArrowLeftRight size={15} className="text-brand-primary shrink-0" />
                    <div>
                        <h3 className="text-sm font-semibold leading-none">Shift Swap Request</h3>
                        <span className={`mt-1 inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-semibold ${MODE_COLOR[swapMode]}`}>
                            {modeLabel}
                        </span>
                    </div>
                </div>
                <button type="button" onClick={onReset} className="rounded-full p-1 hover:bg-surface-muted">
                    <X size={14} className="text-brand-gray" />
                </button>
            </div>

            <div className="p-4 space-y-4">

                {/* ── Pre-submit stage ── */}
                {flow.stage === 'pre_submit' && preview && (
                    <>
                        {/* Before / After Preview */}
                        <SchedulePreview
                            swapMode={swapMode}
                            weekIdx={weekIdx}
                            viewerName={viewerAgent.name}
                            targetName={targetAgent.name}
                            preview={preview}
                        />

                        {/* Pre-validation */}
                        <div>
                            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-brand-gray">Pre-Validation</p>
                            <div className="space-y-1.5">
                                {validation.map((c) => (
                                    <div key={c.rule} className={`flex items-start gap-2 rounded-lg px-3 py-2 text-xs ${c.pass ? 'bg-status-green/8 text-status-green' : 'bg-status-red/8 text-status-red'}`}>
                                        {c.pass
                                            ? <CheckCircle2 size={13} className="mt-0.5 shrink-0" />
                                            : <AlertTriangle size={13} className="mt-0.5 shrink-0" />
                                        }
                                        <div>
                                            <span className="font-medium">{c.rule}</span>
                                            <span className="ml-1 opacity-80">— {c.detail}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Submit button */}
                        {allPass ? (
                            <Button onClick={onSubmit} className="w-full justify-center">
                                <ArrowLeftRight size={14} />
                                Send Swap Request to {targetAgent.name}
                            </Button>
                        ) : (
                            <div className="rounded-lg border border-status-red/20 bg-status-red/5 p-3 text-xs text-status-red">
                                <AlertTriangle size={13} className="mr-1.5 inline-block" />
                                One or more checks failed. The swap request cannot be submitted until all violations are resolved.
                            </div>
                        )}
                    </>
                )}

                {/* ── Pending partner ── */}
                {flow.stage === 'pending_partner' && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-700">
                            <Clock size={13} className="shrink-0" />
                            Request sent to <strong className="ml-0.5">{flow.partnerName}</strong>. Awaiting their response. TL is NOT involved until partner accepts.
                        </div>
                        <div className="rounded-lg border border-dashed border-surface-border p-3">
                            <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-brand-gray">Demo — simulate partner response</p>
                            <div className="flex flex-wrap gap-2">
                                <button type="button" onClick={() => onPartnerAccept(flow.partnerName)}
                                    className="flex items-center gap-1.5 rounded-lg bg-status-green/10 px-3 py-1.5 text-xs font-medium text-status-green hover:bg-status-green/20">
                                    <CheckCircle2 size={12} /> {flow.partnerName} Accepts
                                </button>
                                <button type="button" onClick={() => onPartnerDecline(flow.partnerName)}
                                    className="flex items-center gap-1.5 rounded-lg bg-status-red/10 px-3 py-1.5 text-xs font-medium text-status-red hover:bg-status-red/20">
                                    <X size={12} /> {flow.partnerName} Declines
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Partner declined ── */}
                {flow.stage === 'declined' && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 rounded-lg bg-status-red/8 p-3 text-xs text-status-red">
                            <X size={13} className="shrink-0" />
                            <strong>{flow.partnerName}</strong> declined. TL has NOT been notified.
                        </div>
                        <button type="button" onClick={onBackToPartner} className="text-xs text-brand-primary underline underline-offset-2">
                            ← Try again with a different partner
                        </button>
                    </div>
                )}

                {/* ── Pending TL ── */}
                {flow.stage === 'pending_tl' && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 rounded-lg bg-status-green/8 p-3 text-xs text-status-green">
                            <CheckCircle2 size={13} className="shrink-0" />
                            <strong>{flow.partnerName}</strong> accepted. All checks passed. Request sent to <strong className="ml-0.5">Sarah Chen (TL)</strong> for final approval.
                        </div>
                        <div className="grid grid-cols-2 gap-2 rounded-lg border border-surface-border p-3 text-xs">
                            <div className="flex items-center gap-1.5 text-status-green"><CheckCircle2 size={11} /> 12h rest ✓</div>
                            <div className="flex items-center gap-1.5 text-status-green"><CheckCircle2 size={11} /> Max 7 consecutive ✓</div>
                            <div className="flex items-center gap-1.5 text-status-green"><CheckCircle2 size={11} /> Max weekly hours ✓</div>
                            <div className="flex items-center gap-1.5 text-status-green"><CheckCircle2 size={11} /> Skills maintained ✓</div>
                        </div>
                        <div className="rounded-lg border border-dashed border-surface-border p-3">
                            <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-brand-gray">Demo — simulate TL response</p>
                            <div className="flex flex-wrap gap-2">
                                <button type="button" onClick={onTlApprove}
                                    className="flex items-center gap-1.5 rounded-lg bg-status-green/10 px-3 py-1.5 text-xs font-medium text-status-green hover:bg-status-green/20">
                                    <CheckCircle2 size={12} /> TL Approves
                                </button>
                                <button type="button" onClick={onTlReject}
                                    className="flex items-center gap-1.5 rounded-lg bg-status-red/10 px-3 py-1.5 text-xs font-medium text-status-red hover:bg-status-red/20">
                                    <X size={12} /> TL Rejects
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}

// ─── Before/After schedule preview ────────────────────────────────────────────
type PreviewData = {
    vBefore: DayStatus[]; vAfter: DayStatus[]
    tBefore: DayStatus[]; tAfter: DayStatus[]
    days: string[]
}

function SchedulePreview({ swapMode, weekIdx, viewerName, targetName, preview }: {
    swapMode: SwapMode; weekIdx: number
    viewerName: string; targetName: string; preview: PreviewData
}) {
    const isFullWeek = swapMode === 'full_week'

    if (isFullWeek) {
        // Side-by-side mini grid: Before | After
        return (
            <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-brand-gray">
                    {WEEK_LABELS[weekIdx]} — Before &amp; After Swap
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {[
                        { label: 'BEFORE', v: preview.vBefore, t: preview.tBefore },
                        { label: 'AFTER', v: preview.vAfter, t: preview.tAfter },
                    ].map(({ label, v, t }) => (
                        <div key={label} className={`rounded-lg border p-3 ${label === 'AFTER' ? 'border-brand-primary/30 bg-brand-primary/3' : 'border-surface-border'}`}>
                            <p className="mb-2 text-[10px] font-bold text-brand-gray">{label}</p>
                            <div className="space-y-1.5">
                                {[{ name: viewerName, days: v }, { name: targetName, days: t }].map(({ name, days }) => (
                                    <div key={name}>
                                        <p className="mb-1 text-[10px] font-medium text-brand-gray truncate">{name}</p>
                                        <div className="flex flex-wrap gap-0.5">
                                            {days.map((d, i) => (
                                                <DayPill key={i} status={d} size="sm" />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    // Single / Multi / OFF Day — compact row per affected day
    return (
        <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-brand-gray">Schedule Change Preview</p>
            <div className="overflow-hidden rounded-lg border border-surface-border text-xs">
                <div className="grid grid-cols-4 gap-0 border-b border-surface-border bg-surface-muted/40 text-[10px] font-medium text-brand-gray">
                    <div className="p-2">Day</div>
                    <div className="p-2">{viewerName}</div>
                    <div className="p-2 text-center">→</div>
                    <div className="p-2">{targetName}</div>
                </div>
                {/* Before row */}
                <div className="grid grid-cols-4 gap-0 border-b border-surface-border bg-surface-muted/20">
                    <div className="p-2 font-medium text-brand-gray text-[10px]">BEFORE</div>
                    {preview.days.map((day, i) => (
                        <div key={`vb-${i}`} className="p-1"><DayPill status={preview.vBefore[i]} size="sm" /></div>
                    ))}
                </div>
                <div className="grid grid-cols-4 gap-0 border-b border-surface-border bg-surface-muted/20">
                    <div className="p-2 font-medium text-brand-gray text-[10px]"></div>
                    {preview.days.map((day, i) => (
                        <div key={`tb-${i}`} className="p-1"><DayPill status={preview.tBefore[i]} size="sm" /></div>
                    ))}
                </div>
                <div className="grid grid-cols-4 border-b border-surface-border px-2 py-1 bg-surface-muted/10">
                    <div className="col-span-4 text-center text-[10px] text-brand-gray">↕ after swap</div>
                </div>
                {/* After row */}
                <div className="grid grid-cols-4 gap-0 border-b border-surface-border bg-brand-primary/3">
                    <div className="p-2 font-medium text-[10px] text-brand-primary">AFTER</div>
                    {preview.days.map((day, i) => (
                        <div key={`va-${i}`} className="p-1"><DayPill status={preview.vAfter[i]} size="sm" /></div>
                    ))}
                </div>
                <div className="grid grid-cols-4 gap-0 bg-brand-primary/3">
                    <div className="p-2 font-medium text-[10px] text-brand-primary"></div>
                    {preview.days.map((day, i) => (
                        <div key={`ta-${i}`} className="p-1"><DayPill status={preview.tAfter[i]} size="sm" /></div>
                    ))}
                </div>
                {/* Day labels row */}
                <div className={`grid gap-0 border-t border-surface-border bg-surface-muted/40 text-[9px] text-brand-gray`} style={{ gridTemplateColumns: `auto repeat(${preview.days.length}, 1fr)` }}>
                    <div className="p-1.5"></div>
                    {preview.days.map((d, i) => (
                        <div key={i} className="p-1.5 text-center font-medium">{d}</div>
                    ))}
                </div>
            </div>
        </div>
    )
}

// ─── TL swap card (per request) ───────────────────────────────────────────────
function TlSwapCard({
    req, status, onApprove, onDecline,
}: {
    req: TlPending
    status: 'pending' | 'approved' | 'declined'
    onApprove: () => void
    onDecline: () => void
}) {
    return (
        <div className="p-4">
            {status === 'pending' ? (
                <div className="space-y-3">
                    {/* Header */}
                    <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-semibold ${MODE_COLOR[req.mode]}`}>
                            {req.modeLabel}
                        </span>
                        <span className="text-sm font-medium">{req.initiator} ↔ {req.partner}</span>
                        <span className="text-xs text-brand-gray">· {req.days}</span>
                    </div>

                    {/* Schedule comparison */}
                    {req.mode === 'full_week' ? (
                        <div className="grid grid-cols-2 gap-3 text-xs">
                            {([{ label: 'BEFORE', grid: req.beforeGrid }, { label: 'AFTER', grid: req.afterGrid }] as const).map(({ label, grid }) => (
                                <div key={label} className={`rounded-lg border p-2.5 ${label === 'AFTER' ? 'border-brand-primary/30 bg-brand-primary/3' : 'border-surface-border'}`}>
                                    <p className="mb-1.5 text-[10px] font-bold text-brand-gray">{label}</p>
                                    {([
                                        { name: req.initiator, days: grid.initiator },
                                        { name: req.partner,   days: grid.partner },
                                    ] as const).map(({ name, days }) => (
                                        <div key={name} className="mb-1.5">
                                            <p className="mb-1 text-[10px] text-brand-gray truncate">{name}</p>
                                            <div className="flex flex-wrap gap-0.5">
                                                {days.map((d, i) => <DayPill key={i} status={d} size="sm" />)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="rounded bg-surface-muted p-2">
                                <p className="text-brand-gray">{req.initiator}</p>
                                <p className="font-medium">{req.before.initiator}</p>
                            </div>
                            <div className="rounded bg-surface-muted p-2">
                                <p className="text-brand-gray">{req.partner}</p>
                                <p className="font-medium">{req.before.partner}</p>
                            </div>
                        </div>
                    )}

                    {/* Badges */}
                    <div className="flex flex-wrap gap-1.5">
                        {req.badges.map((b) => (
                            <Badge key={b} variant="green">{b}</Badge>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                        <Button size="sm" onClick={onApprove}><CheckCircle2 size={13} /> Approve</Button>
                        <Button size="sm" variant="ghost" onClick={onDecline}>Decline</Button>
                    </div>
                </div>
            ) : status === 'approved' ? (
                <div className="flex items-center gap-2 rounded-lg bg-status-green/8 p-3 text-sm text-status-green">
                    <CheckCircle2 size={14} className="shrink-0" />
                    {req.modeLabel} approved. {req.initiator} &amp; {req.partner} notified. Schedules updated.
                </div>
            ) : (
                <div className="rounded-lg bg-surface-muted/40 p-3 text-sm text-brand-gray">
                    {req.modeLabel} declined. Agents notified. No schedule changes.
                </div>
            )}
        </div>
    )
}
