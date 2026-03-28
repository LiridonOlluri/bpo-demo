'use client'

import { StatCard } from '@/components/molecules/StatCard'
import { Card } from '@/components/atoms/Card'
import { ScheduleTimeline } from '@/components/organisms/ScheduleTimeline'
import { StaffingGapChart } from '@/components/organisms/StaffingGapChart'
import { TeamScheduleGrid } from '@/components/organisms/TeamScheduleGrid'

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
    { name: 'Agent #12',    shift: { start: '07:00', end: '15:00', type: 'early' as const }, breaks: [{ start: '09:30', end: '09:45', type: 'break' as const }, { start: '12:30', end: '13:00', type: 'break' as const }] },
    { name: 'Agent #33',    shift: { start: '10:00', end: '18:00', type: 'mid' as const   }, breaks: [{ start: '12:00', end: '12:15', type: 'break' as const }, { start: '14:30', end: '15:00', type: 'break' as const }] },
    { name: 'Agent #7',     shift: { start: '10:00', end: '18:00', type: 'mid' as const   }, breaks: [{ start: '12:30', end: '12:45', type: 'break' as const }, { start: '15:00', end: '15:30', type: 'break' as const }] },
    { name: 'Frank Osei',   shift: { start: '10:00', end: '18:00', type: 'mid' as const   }, breaks: [{ start: '13:00', end: '13:15', type: 'break' as const }, { start: '15:30', end: '16:00', type: 'break' as const }] },
    { name: 'Agent #28',    shift: { start: '16:00', end: '00:00', type: 'late' as const  }, breaks: [{ start: '18:00', end: '18:15', type: 'break' as const }, { start: '21:00', end: '21:30', type: 'break' as const }] },
]

export default function MyTeamSchedulePage() {
    return (
        <div className="space-y-5">
            <div className="mb-2">
                <h1 className="text-xl font-bold tracking-tight">My Team Operations — Schedule</h1>
                <p className="text-sm text-brand-gray">3-week grid · Gantt today · gap analysis · view + approve swaps (cannot generate or publish)</p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatCard label="Team Size"   value={10} variant="default" />
                <StatCard label="Early Shift" value={4}  variant="default" trendValue="07:00–15:00" />
                <StatCard label="Mid Shift"   value={4}  variant="green"   trendValue="10:00–18:00" />
                <StatCard label="Late Shift"  value={2}  variant="amber"   trendValue="16:00–00:00" />
            </div>

            {/* Shared grid — TL mode (approve/decline) */}
            <TeamScheduleGrid mode="tl" />

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
