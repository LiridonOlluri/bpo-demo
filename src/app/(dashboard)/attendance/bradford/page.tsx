'use client'

import { DashboardTemplate } from '@/components/templates/DashboardTemplate'
import { BradfordTable } from '@/components/organisms/BradfordTable'
import { StatCard } from '@/components/molecules/StatCard'
import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
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
        agentId: 'Daniel Reyess',
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

const missingMinutesData = [
    { agent: 'Agent #7', team: 'Team B', minutes: 22, otStatus: 'blocked', note: 'Must compensate before end of week' },
    { agent: 'Agent #12', team: 'Team A', minutes: 3, otStatus: 'blocked', note: 'Clocked in 8 min late on 25 Mar (5 min grace applied)' },
    { agent: 'Agent #14', team: 'Team C', minutes: 0, otStatus: 'eligible', note: '' },
    { agent: 'Agent #19', team: 'Team D', minutes: 0, otStatus: 'eligible', note: '' },
    { agent: 'Agent #22', team: 'Team B', minutes: 15, otStatus: 'blocked', note: 'Extended break (2×)' },
    { agent: 'Agent #31', team: 'Team E', minutes: 0, otStatus: 'eligible', note: '' },
]
const totalMissingMin = missingMinutesData.reduce((s, r) => s + r.minutes, 0)
const HOURLY_RATE = 4.55
const eurCost = ((totalMissingMin / 60) * HOURLY_RATE).toFixed(2)

export default function BradfordPage() {
    return (
        <DashboardTemplate
            title="Bradford Factor & Missing Minutes"
            statCards={
                <>
                    <StatCard label="Agents Monitored" value={monitored} variant="default" />
                    <StatCard label="Amber Alerts" value={amberAlerts} variant={amberAlerts > 0 ? 'amber' : 'default'} />
                    <StatCard label="Red Alerts" value={redAlerts} variant={redAlerts > 0 ? 'red' : 'default'} />
                    <StatCard label="Critical" value={critical} variant={critical > 0 ? 'red' : 'default'} />
                    <StatCard label="Team Missing Min" value={`${totalMissingMin} min`} variant={totalMissingMin > 0 ? 'amber' : 'green'} trendValue={`€${eurCost} cost impact`} />
                </>
            }
        >
            <div className="space-y-6">
                {/* Missing Minutes Tracker */}
                <Card padding={false}>
                    <div className="border-b border-surface-border p-4">
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-gray">Missing Minutes Tracker</h2>
                        <p className="text-xs text-brand-gray mt-1">OT bidding is blocked until each agent clears their balance. Compensation window: same week.</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-surface-border text-left text-xs text-brand-gray">
                                    <th className="p-4 font-medium">Agent</th>
                                    <th className="p-4 font-medium">Team</th>
                                    <th className="p-4 font-medium text-right">Missing Min</th>
                                    <th className="p-4 font-medium">OT Status</th>
                                    <th className="p-4 font-medium">Note</th>
                                </tr>
                            </thead>
                            <tbody>
                                {missingMinutesData.map((row) => (
                                    <tr key={row.agent} className={`border-b border-surface-border last:border-0 ${row.minutes > 0 ? 'bg-status-amber/5' : ''}`}>
                                        <td className="p-4 font-medium">{row.agent}</td>
                                        <td className="p-4 text-brand-gray">{row.team}</td>
                                        <td className="p-4 text-right">
                                            <span className={row.minutes > 0 ? 'font-bold text-status-amber' : 'text-status-green'}>
                                                {row.minutes} min
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <Badge variant={row.otStatus === 'blocked' ? 'red' : 'green'}>
                                                {row.otStatus === 'blocked' ? 'OT Blocked' : 'OT Eligible'}
                                            </Badge>
                                        </td>
                                        <td className="p-4 text-xs text-brand-gray">{row.note}</td>
                                    </tr>
                                ))}
                                <tr className="border-t-2 border-surface-border bg-surface-muted/30 font-semibold">
                                    <td className="p-4" colSpan={2}>Team Total</td>
                                    <td className="p-4 text-right text-status-amber">{totalMissingMin} min</td>
                                    <td className="p-4 text-xs text-brand-gray">€{eurCost} cost impact</td>
                                    <td className="p-4" />
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Card>

                <BradfordTable entries={mockEntries} />
            </div>
        </DashboardTemplate>
    )
}
