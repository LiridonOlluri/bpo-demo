'use client'

import { DashboardTemplate } from '@/components/templates/DashboardTemplate'
import { BradfordTable } from '@/components/organisms/BradfordTable'
import { StatCard } from '@/components/molecules/StatCard'
import type { BradfordEntry } from '@/types/leave'

const mockEntries: BradfordEntry[] = [
    {
        agentId: 'Priya Sharma',
        spells: 5,
        totalDays: 8,
        score: 200,
        threshold: 'red',
        patterns: { mondayFridayClustering: true, prePostHoliday: false, frequencyFlag: true },
        sickDays: [
            { date: '2026-01-06', dayOfWeek: 'Mon', spell: 1 },
            { date: '2026-01-20', dayOfWeek: 'Mon', spell: 2 },
            { date: '2026-02-06', dayOfWeek: 'Fri', spell: 3 },
            { date: '2026-02-07', dayOfWeek: 'Sat', spell: 3 },
            { date: '2026-02-23', dayOfWeek: 'Mon', spell: 4 },
            { date: '2026-02-24', dayOfWeek: 'Tue', spell: 4 },
            { date: '2026-03-13', dayOfWeek: 'Fri', spell: 5 },
            { date: '2026-03-14', dayOfWeek: 'Sat', spell: 5 },
        ],
    },
    {
        agentId: 'Quinn Davis',
        spells: 4,
        totalDays: 6,
        score: 96,
        threshold: 'amber',
        patterns: { mondayFridayClustering: false, prePostHoliday: true, frequencyFlag: false },
        sickDays: [
            { date: '2026-01-02', dayOfWeek: 'Fri', spell: 1 },
            { date: '2026-02-16', dayOfWeek: 'Mon', spell: 2 },
            { date: '2026-02-17', dayOfWeek: 'Tue', spell: 2 },
            { date: '2026-03-02', dayOfWeek: 'Mon', spell: 3 },
            { date: '2026-03-16', dayOfWeek: 'Mon', spell: 4 },
            { date: '2026-03-17', dayOfWeek: 'Tue', spell: 4 },
        ],
    },
    {
        agentId: 'Alice Monroe',
        spells: 1,
        totalDays: 2,
        score: 2,
        threshold: 'green',
        patterns: { mondayFridayClustering: false, prePostHoliday: false, frequencyFlag: false },
        sickDays: [
            { date: '2026-02-10', dayOfWeek: 'Tue', spell: 1 },
            { date: '2026-02-11', dayOfWeek: 'Wed', spell: 1 },
        ],
    },
    {
        agentId: 'Ben Carter',
        spells: 2,
        totalDays: 3,
        score: 12,
        threshold: 'green',
        patterns: { mondayFridayClustering: false, prePostHoliday: false, frequencyFlag: false },
        sickDays: [
            { date: '2026-01-15', dayOfWeek: 'Thu', spell: 1 },
            { date: '2026-03-04', dayOfWeek: 'Wed', spell: 2 },
            { date: '2026-03-05', dayOfWeek: 'Thu', spell: 2 },
        ],
    },
    {
        agentId: 'Clara Singh',
        spells: 1,
        totalDays: 1,
        score: 1,
        threshold: 'green',
        patterns: { mondayFridayClustering: false, prePostHoliday: false, frequencyFlag: false },
        sickDays: [{ date: '2026-03-09', dayOfWeek: 'Mon', spell: 1 }],
    },
    {
        agentId: 'Daniel Reyes',
        spells: 0,
        totalDays: 0,
        score: 0,
        threshold: 'green',
        patterns: { mondayFridayClustering: false, prePostHoliday: false, frequencyFlag: false },
        sickDays: [],
    },
    {
        agentId: 'Frank Osei',
        spells: 2,
        totalDays: 2,
        score: 8,
        threshold: 'green',
        patterns: { mondayFridayClustering: false, prePostHoliday: false, frequencyFlag: false },
        sickDays: [
            { date: '2026-01-22', dayOfWeek: 'Thu', spell: 1 },
            { date: '2026-02-26', dayOfWeek: 'Thu', spell: 2 },
        ],
    },
    {
        agentId: 'Grace Kim',
        spells: 1,
        totalDays: 3,
        score: 3,
        threshold: 'green',
        patterns: { mondayFridayClustering: false, prePostHoliday: false, frequencyFlag: false },
        sickDays: [
            { date: '2026-02-03', dayOfWeek: 'Tue', spell: 1 },
            { date: '2026-02-04', dayOfWeek: 'Wed', spell: 1 },
            { date: '2026-02-05', dayOfWeek: 'Thu', spell: 1 },
        ],
    },
]

const monitored = mockEntries.length
const amberAlerts = mockEntries.filter((e) => e.threshold === 'amber').length
const redAlerts = mockEntries.filter((e) => e.threshold === 'red').length
const critical = mockEntries.filter((e) => e.threshold === 'critical').length

export default function BradfordPage() {
    return (
        <DashboardTemplate
            title="Bradford Factor"
            statCards={
                <>
                    <StatCard label="Agents Monitored" value={monitored} variant="default" />
                    <StatCard label="Amber Alerts" value={amberAlerts} variant={amberAlerts > 0 ? 'amber' : 'default'} />
                    <StatCard label="Red Alerts" value={redAlerts} variant={redAlerts > 0 ? 'red' : 'default'} />
                    <StatCard label="Critical" value={critical} variant={critical > 0 ? 'red' : 'default'} />
                </>
            }
        >
            <BradfordTable entries={mockEntries} />
        </DashboardTemplate>
    )
}
