'use client'

import { useState } from 'react'
import { DashboardTemplate } from '@/components/templates/DashboardTemplate'
import { ScheduleTimeline } from '@/components/organisms/ScheduleTimeline'
import { StaffingGapChart } from '@/components/organisms/StaffingGapChart'
import { Card } from '@/components/atoms/Card'

const mockAgents = [
    { name: 'Alice Monroe', shift: { start: '07:00', end: '15:30', type: 'early' as const }, breaks: [{ start: '10:00', end: '10:15', type: 'break' as const }, { start: '12:00', end: '12:30', type: 'break' as const }] },
    { name: 'Ben Carter', shift: { start: '07:00', end: '15:30', type: 'early' as const }, breaks: [{ start: '09:30', end: '09:45', type: 'break' as const }, { start: '12:30', end: '13:00', type: 'break' as const }] },
    { name: 'Clara Singh', shift: { start: '08:00', end: '16:30', type: 'mid' as const }, breaks: [{ start: '10:30', end: '10:45', type: 'break' as const }, { start: '13:00', end: '13:30', type: 'break' as const }] },
    { name: 'Daniel Reyes', shift: { start: '08:00', end: '16:30', type: 'mid' as const }, breaks: [{ start: '11:00', end: '11:15', type: 'break' as const }, { start: '13:30', end: '14:00', type: 'break' as const }] },
    { name: 'Ella Brooks', shift: { start: '09:00', end: '17:30', type: 'mid' as const }, breaks: [{ start: '11:30', end: '11:45', type: 'break' as const }, { start: '14:00', end: '14:30', type: 'break' as const }] },
    { name: 'Frank Osei', shift: { start: '10:00', end: '18:30', type: 'mid' as const }, breaks: [{ start: '12:00', end: '12:15', type: 'break' as const }, { start: '15:00', end: '15:30', type: 'break' as const }] },
    { name: 'Grace Kim', shift: { start: '12:00', end: '20:30', type: 'late' as const }, breaks: [{ start: '14:30', end: '14:45', type: 'break' as const }, { start: '17:00', end: '17:30', type: 'break' as const }] },
    { name: 'Hasan Ali', shift: { start: '14:00', end: '22:00', type: 'late' as const }, breaks: [{ start: '16:00', end: '16:15', type: 'break' as const }, { start: '18:30', end: '19:00', type: 'break' as const }] },
    { name: 'Isla Novak', shift: { start: '15:00', end: '23:00', type: 'late' as const }, breaks: [{ start: '17:30', end: '17:45', type: 'break' as const }, { start: '20:00', end: '20:30', type: 'break' as const }] },
    { name: 'James Patel', shift: { start: '07:00', end: '15:30', type: 'early' as const }, breaks: [{ start: '10:15', end: '10:30', type: 'break' as const }, { start: '12:15', end: '12:45', type: 'break' as const }] },
]

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
    { time: '17:00', requiredAgents: 6, scheduledAgents: 5, actualAgents: 5 },
    { time: '18:00', requiredAgents: 5, scheduledAgents: 4, actualAgents: 4 },
    { time: '19:00', requiredAgents: 4, scheduledAgents: 3, actualAgents: 3 },
    { time: '20:00', requiredAgents: 3, scheduledAgents: 3, actualAgents: 3 },
    { time: '21:00', requiredAgents: 2, scheduledAgents: 2, actualAgents: 2 },
    { time: '22:00', requiredAgents: 1, scheduledAgents: 1, actualAgents: 1 },
]

export default function SchedulePage() {
    const [selectedDate, setSelectedDate] = useState(() => {
        const d = new Date()
        return d.toISOString().split('T')[0]
    })

    return (
        <DashboardTemplate
            title="Schedule"
            actions={
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="rounded-lg border border-surface-border bg-surface px-3 py-1.5 text-sm"
                />
            }
        >
            <div className="space-y-6">
                <Card>
                    <h2 className="mb-4 text-sm font-semibold">Agent Shifts — {selectedDate}</h2>
                    <ScheduleTimeline agents={mockAgents} />
                </Card>

                <Card>
                    <h2 className="mb-4 text-sm font-semibold">Staffing Gap Analysis</h2>
                    <StaffingGapChart data={mockGapData} />
                </Card>
            </div>
        </DashboardTemplate>
    )
}
