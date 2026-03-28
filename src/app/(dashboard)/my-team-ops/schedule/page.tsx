'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import { StatCard } from '@/components/molecules/StatCard'
import { ScheduleTimeline } from '@/components/organisms/ScheduleTimeline'
import { StaffingGapChart } from '@/components/organisms/StaffingGapChart'
import { CheckCircle2, Info } from 'lucide-react'

// ── 3-week schedule grid data (own 10 agents) ─────────────────────────────────
type DayStatus = 'E' | 'M' | 'L' | 'OFF' | 'PL' | 'SL' | 'TR' | 'NE' | 'OVR'

interface ScheduleAgent {
    id: string; name: string; skill: string; status: string
    shiftStart: string; shiftEnd: string
    weeks: DayStatus[][]
}

const DAYS_W1 = ['Mon\n31/3', 'Tue\n1/4', 'Wed\n2/4', 'Thu\n3/4', 'Fri\n4/4', 'Sat\n5/4', 'Sun\n6/4']
const DAYS_W2 = ['Mon\n7/4', 'Tue\n8/4', 'Wed\n9/4', 'Thu\n10/4', 'Fri\n11/4', 'Sat\n12/4', 'Sun\n13/4']
const DAYS_W3 = ['Mon\n14/4', 'Tue\n15/4', 'Wed\n16/4', 'Thu\n17/4', 'Fri\n18/4', 'Sat\n19/4', 'Sun\n20/4']

const AGENTS: ScheduleAgent[] = [
    { id: '#12', name: 'Agent #12', skill: 'Voice', status: 'FT', shiftStart: '07:00', shiftEnd: '15:00', weeks: [['E','E','E','M','E','OFF','OFF'],['E','E','E','E','E','OFF','OFF'],['E','E','OFF','E','E','E','OFF']] },
    { id: '#7',  name: 'Agent #7',  skill: 'Voice', status: 'FT', shiftStart: '10:00', shiftEnd: '18:00', weeks: [['M','M','M','M','OFF','OFF','M'],['M','OFF','M','M','M','M','OFF'],['OFF','M','M','M','OFF','M','M']] },
    { id: '#22', name: 'Agent #22', skill: 'Voice', status: 'FT', shiftStart: '07:00', shiftEnd: '15:00', weeks: [['E','E','OFF','E','E','OFF','OFF'],['E','E','E','E','OFF','OFF','E'],['E','E','E','OFF','E','E','OFF']] },
    { id: '#28', name: 'Agent #28', skill: 'Voice', status: 'FT', shiftStart: '16:00', shiftEnd: '00:00', weeks: [['L','L','OFF','L','L','OFF','OFF'],['L','OFF','L','L','L','L','OFF'],['L','L','L','OFF','OFF','L','L']] },
    { id: '#33', name: 'Agent #33', skill: 'Voice', status: 'FT', shiftStart: '10:00', shiftEnd: '18:00', weeks: [['M','M','M','E','M','OFF','OFF'],['OFF','M','M','M','M','M','OFF'],['M','M','OFF','M','M','OFF','M']] },
    { id: 'alice', name: 'Alice Monroe', skill: 'Voice', status: 'FT', shiftStart: '07:00', shiftEnd: '15:00', weeks: [['E','E','E','OFF','E','E','OFF'],['E','E','OFF','E','E','E','OFF'],['OFF','E','E','E','E','OFF','E']] },
    { id: 'ella', name: 'Ella Brooks', skill: 'Voice', status: 'FT', shiftStart: '07:00', shiftEnd: '15:00', weeks: [['E','OFF','E','E','E','OFF','OFF'],['E','E','E','OFF','E','E','OFF'],['E','E','E','E','OFF','OFF','E']] },
    { id: 'frank', name: 'Frank Osei', skill: 'Chat', status: 'FT', shiftStart: '10:00', shiftEnd: '18:00', weeks: [['M','M','OFF','M','M','OFF','M'],['M','M','M','M','OFF','OFF','M'],['M','OFF','M','M','M','M','OFF']] },
    { id: 'grace', name: 'Grace Kim', skill: 'Chat', status: 'FT', shiftStart: '10:00', shiftEnd: '18:00', weeks: [['M','TR','TR','TR','M','OFF','OFF'],['M','M','OFF','M','M','M','OFF'],['OFF','M','M','M','M','OFF','M']] },
    { id: 'ryan', name: 'Ryan Costa', skill: 'Voice', status: 'FT', shiftStart: '07:00', shiftEnd: '15:00', weeks: [['SL','E','E','E','OFF','OFF','E'],['E','E','E','OFF','E','E','OFF'],['E','E','OFF','E','E','E','OFF']] },
]

const DAY_STYLE: Record<DayStatus, string> = {
    E: 'bg-white border-surface-border text-[10px]',
    M: 'bg-white border-surface-border text-[10px]',
    L: 'bg-white border-surface-border text-[10px]',
    OFF: 'bg-green-100 border-green-200 text-[10px] text-green-700',
    PL: 'bg-orange-100 border-orange-200 text-[10px] text-orange-700',
    SL: 'bg-red-100 border-red-200 text-[10px] text-red-700',
    TR: 'bg-blue-100 border-blue-200 text-[10px] text-blue-700',
    NE: 'bg-sky-100 border-sky-200 text-[10px] text-sky-700',
    OVR: 'bg-yellow-50 border-yellow-300 text-[10px] text-yellow-700',
}
const DAY_LABEL: Record<DayStatus, string> = { E: '07-15', M: '10-18', L: '16-00', OFF: 'OFF', PL: 'P/L', SL: 'Sick', TR: 'Train', NE: 'Nest', OVR: 'OVR' }

const mockGapData = [
    { time: '07:00', requiredAgents: 4, scheduledAgents: 3, actualAgents: 3 },
    { time: '08:00', requiredAgents: 6, scheduledAgents: 5, actualAgents: 5 },
    { time: '09:00', requiredAgents: 8, scheduledAgents: 7, actualAgents: 6 },
    { time: '10:00', requiredAgents: 10, scheduledAgents: 8, actualAgents: 8 },
    { time: '11:00', requiredAgents: 10, scheduledAgents: 9, actualAgents: 9 },
    { time: '12:00', requiredAgents: 9, scheduledAgents: 9, actualAgents: 8 },
    { time: '13:00', requiredAgents: 8, scheduledAgents: 8, actualAgents: 8 },
    { time: '14:00', requiredAgents: 9, scheduledAgents: 9, actualAgents: 9 },
    { time: '15:00', requiredAgents: 8, scheduledAgents: 7, actualAgents: 7 },
    { time: '16:00', requiredAgents: 7, scheduledAgents: 6, actualAgents: 5 },
]

const mockTimeline = [
    { name: 'Alice Monroe', shift: { start: '07:00', end: '15:00', type: 'early' as const }, breaks: [{ start: '10:00', end: '10:15', type: 'break' as const }, { start: '12:00', end: '12:30', type: 'break' as const }] },
    { name: 'Agent #12', shift: { start: '07:00', end: '15:00', type: 'early' as const }, breaks: [{ start: '09:30', end: '09:45', type: 'break' as const }, { start: '12:30', end: '13:00', type: 'break' as const }] },
    { name: 'Agent #33', shift: { start: '10:00', end: '18:00', type: 'mid' as const }, breaks: [{ start: '12:00', end: '12:15', type: 'break' as const }, { start: '14:30', end: '15:00', type: 'break' as const }] },
    { name: 'Agent #7', shift: { start: '10:00', end: '18:00', type: 'mid' as const }, breaks: [{ start: '12:30', end: '12:45', type: 'break' as const }, { start: '15:00', end: '15:30', type: 'break' as const }] },
    { name: 'Frank Osei', shift: { start: '10:00', end: '18:00', type: 'mid' as const }, breaks: [{ start: '13:00', end: '13:15', type: 'break' as const }, { start: '15:30', end: '16:00', type: 'break' as const }] },
    { name: 'Agent #28', shift: { start: '16:00', end: '00:00', type: 'late' as const }, breaks: [{ start: '18:00', end: '18:15', type: 'break' as const }, { start: '21:00', end: '21:30', type: 'break' as const }] },
]

export default function MyTeamSchedulePage() {
    const [swapApproved, setSwapApproved] = useState(false)
    const [activeWeek, setActiveWeek] = useState(0)

    const weekDays = [DAYS_W1, DAYS_W2, DAYS_W3][activeWeek]

    return (
        <div className="space-y-5">
            <div className="mb-2">
                <h1 className="text-xl font-bold tracking-tight">My Team Operations — Schedule</h1>
                <p className="text-sm text-brand-gray">3-week grid · Gantt today · gap analysis · view + approve swaps (cannot generate or publish)</p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatCard label="Team Size" value={10} variant="default" />
                <StatCard label="Early Shift" value={4} variant="default" trendValue="07:00–15:00" />
                <StatCard label="Mid Shift" value={4} variant="green" trendValue="10:00–18:00" />
                <StatCard label="Late Shift" value={2} variant="amber" trendValue="16:00–00:00" />
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50 flex items-start gap-2 p-3 text-xs text-amber-700">
                <Info size={14} className="shrink-0 mt-0.5" />
                <p>TL view: you can <strong>view</strong> this schedule and <strong>approve swap requests</strong>. Schedule generation and publication is WFM Manager (Level 4) authority.</p>
            </div>

            {/* 3-week grid */}
            <Card padding={false}>
                <div className="flex items-center justify-between border-b border-surface-border p-4">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-gray">3-Week Schedule Grid</h2>
                    <div className="flex gap-1">
                        {['Week 1 (31 Mar–6 Apr)', 'Week 2 (7–13 Apr)', 'Week 3 (14–20 Apr)'].map((w, i) => (
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
                                <th className="sticky left-0 bg-surface-muted/60 p-2 text-left font-medium text-brand-gray w-[120px]">Agent</th>
                                <th className="p-2 text-left font-medium text-brand-gray">Skill</th>
                                <th className="p-2 text-left font-medium text-brand-gray">Shift</th>
                                {weekDays.map((d, i) => (
                                    <th key={i} className="p-2 text-center font-medium text-brand-gray min-w-[52px] whitespace-pre-line">{d}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {AGENTS.map((a) => (
                                <tr key={a.id} className={`border-b border-surface-border hover:bg-surface-muted/30 ${a.id === '#12' ? 'bg-green-50/40' : ''}`}>
                                    <td className="sticky left-0 bg-white p-2 font-medium">{a.name}</td>
                                    <td className="p-2"><Badge variant={a.skill === 'Voice' ? 'blue' : 'green'}>{a.skill}</Badge></td>
                                    <td className="p-2 text-brand-gray">{a.shiftStart}–{a.shiftEnd}</td>
                                    {a.weeks[activeWeek].map((day, i) => (
                                        <td key={i} className="p-1 text-center">
                                            <div className={`mx-auto flex h-8 w-11 items-center justify-center rounded border font-medium ${DAY_STYLE[day]}`}>
                                                {DAY_LABEL[day]}
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex flex-wrap items-center gap-3 border-t border-surface-border p-3 text-[11px]">
                    {Object.entries({ 'Early': 'bg-white border border-surface-border', 'OFF': 'bg-green-100', 'Paid Leave': 'bg-orange-100', 'Sick': 'bg-red-100', 'Training': 'bg-blue-100', 'Nesting': 'bg-sky-100' }).map(([k, c]) => (
                        <div key={k} className="flex items-center gap-1">
                            <div className={`h-3 w-3 rounded ${c}`} />
                            <span className="text-brand-gray">{k}</span>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Pending swap approval */}
            <Card>
                <h2 className="mb-3 text-sm font-semibold">Pending Swap Requests</h2>
                {!swapApproved ? (
                    <div className="rounded-lg border border-surface-border p-3 text-sm space-y-2">
                        <p><span className="font-medium">Agent #12</span> ↔ <span className="font-medium">Agent #33</span> · Thursday 3/4</p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="rounded bg-surface-muted p-2"><p className="text-brand-gray">Agent #12 swaps from</p><p className="font-medium">Early 07:00–15:00</p></div>
                            <div className="rounded bg-surface-muted p-2"><p className="text-brand-gray">Agent #33 swaps from</p><p className="font-medium">Mid 10:00–18:00</p></div>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            <Badge variant="green">Compliance: passed</Badge>
                            <Badge variant="green">Skills: maintained</Badge>
                            <Badge variant="green">Agent #33: accepted</Badge>
                        </div>
                        <div className="flex gap-2">
                            <Button size="sm" onClick={() => { setSwapApproved(true); toast.success('Swap approved', { description: 'Both agents notified. Schedules updated. WFM recalculated.' }) }}>
                                <CheckCircle2 size={13} /> Approve
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => toast.info('Swap declined')}>Decline</Button>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                        ✓ Swap approved. Agent #12 and Agent #33 Thursday schedules swapped. Payroll adjusted for shift differential.
                    </div>
                )}
            </Card>

            {/* Today's Timeline — Gantt */}
            <Card>
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-gray">Today&apos;s Timeline — Gantt View</h2>
                <ScheduleTimeline agents={mockTimeline} />
            </Card>

            {/* Staffing Gap Analysis */}
            <Card>
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-gray">Staffing Gap Analysis</h2>
                <StaffingGapChart data={mockGapData} />
            </Card>
        </div>
    )
}
