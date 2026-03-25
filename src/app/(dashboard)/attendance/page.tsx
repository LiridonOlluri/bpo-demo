'use client'

import { DashboardTemplate } from '@/components/templates/DashboardTemplate'
import { AttendanceGrid } from '@/components/organisms/AttendanceGrid'
import { AlertBanner } from '@/components/molecules/AlertBanner'
import { StatCard } from '@/components/molecules/StatCard'
import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import { AiFeatureLock } from '@/components/molecules/AiFeatureLock'

type AttendanceStatus = 'on-time' | 'late' | 'absent' | 'ncns' | 'on-leave' | 'not-started'

// Demo scenario: Early shift 07:00-15:00, 18 agents scheduled
// By 07:05: 15 on-time, 2 late (7 min + 12 min), 1 NCNS
const mockAgents: { id: string; name: string; status: AttendanceStatus; tardiness?: number; team?: string; shift?: string }[] = [
    { id: 'a01', name: 'Alice Monroe', status: 'on-time', team: 'Team A', shift: 'Early 07:00-15:00' },
    { id: 'a02', name: 'Ben Carter', status: 'on-time', team: 'Team A', shift: 'Early 07:00-15:00' },
    { id: 'a03', name: 'Clara Singh', status: 'on-time', team: 'Team A', shift: 'Early 07:00-15:00' },
    { id: 'a04', name: 'Daniel Reyes', status: 'on-time', team: 'Team A', shift: 'Early 07:00-15:00' },
    { id: 'a05', name: 'Ella Brooks', status: 'on-time', team: 'Team B', shift: 'Early 07:00-15:00' },
    { id: 'a06', name: 'Frank Osei', status: 'on-time', team: 'Team B', shift: 'Early 07:00-15:00' },
    { id: 'a07', name: 'Grace Kim', status: 'on-time', team: 'Team B', shift: 'Early 07:00-15:00' },
    { id: 'a08', name: 'Hasan Ali', status: 'on-time', team: 'Team B', shift: 'Early 07:00-15:00' },
    { id: 'a09', name: 'Isla Novak', status: 'on-time', team: 'Team C', shift: 'Early 07:00-15:00' },
    { id: 'a10', name: 'James Patel', status: 'on-time', team: 'Team C', shift: 'Early 07:00-15:00' },
    { id: 'a11', name: 'Karen Müller', status: 'on-time', team: 'Team C', shift: 'Early 07:00-15:00' },
    { id: 'a12', name: "Liam O'Brien", status: 'on-time', team: 'Team D', shift: 'Early 07:00-15:00' },
    { id: 'a13', name: 'Maya Johnson', status: 'on-time', team: 'Team D', shift: 'Early 07:00-15:00' },
    { id: 'a14', name: 'Nina Kowalski', status: 'on-time', team: 'Team D', shift: 'Early 07:00-15:00' },
    { id: 'a15', name: 'Oscar Tran', status: 'on-time', team: 'Team E', shift: 'Early 07:00-15:00' },
    { id: 'a16', name: 'Priya Sharma', status: 'late', tardiness: 7, team: 'Team B', shift: 'Early 07:00-15:00' },
    { id: 'a17', name: 'Quinn Davis', status: 'late', tardiness: 12, team: 'Team D', shift: 'Early 07:00-15:00' },
    { id: 'a18', name: 'Ryan Costa', status: 'ncns', team: 'Team B', shift: 'Early 07:00-15:00' },
]

const totalScheduled = mockAgents.length
const loggedIn = mockAgents.filter((a) => a.status !== 'ncns' && a.status !== 'absent').length
const onTime = mockAgents.filter((a) => a.status === 'on-time').length
const late = mockAgents.filter((a) => a.status === 'late').length
const absent = mockAgents.filter((a) => a.status === 'absent').length
const ncns = mockAgents.filter((a) => a.status === 'ncns').length
const onTimeRate = ((onTime / totalScheduled) * 100).toFixed(1)

export default function AttendancePage() {
    return (
        <DashboardTemplate
            title="Attendance — Early Shift (07:00-15:00)"
            statCards={
                <>
                    <StatCard label="Total Scheduled" value={totalScheduled} variant="default" />
                    <StatCard label="Logged In" value={loggedIn} variant="green" />
                    <StatCard label="On-Time Rate" value={`${onTimeRate}%`} variant={Number(onTimeRate) >= 90 ? 'green' : 'amber'} />
                    <StatCard label="Late" value={late} variant="amber" />
                    <StatCard label="Absent" value={absent} variant={absent > 0 ? 'red' : 'default'} />
                    <StatCard label="NCNS" value={ncns} variant={ncns > 0 ? 'red' : 'default'} />
                </>
            }
        >
            <div className="space-y-4">
                {ncns > 0 && (
                    <AlertBanner
                        variant="red"
                        message="NCNS Alert: Ryan Costa (Team B) has not logged in and made no contact. Sick-leave check or disciplinary path triggered. Escalation to TL Marcus Jones."
                    />
                )}

                <AlertBanner
                    variant="amber"
                    message="SL Projection: With 15/18 agents, projected SL for 07:00-08:00 = 74% (target 80%). Suggestion: extend 2 agents from overnight or offer early start to Mid-shift agents."
                />

                {/* Shrinkage impact callout */}
                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-semibold">Shrinkage Impact — This Interval</h3>
                            <p className="text-xs text-brand-gray mt-1">
                                3 agents late/absent → unplanned shrinkage spiked from planned 9% to <span className="font-semibold text-status-red">14%</span> for this interval
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Badge variant="amber">Tardiness: 7 min, 12 min → payroll deduction flagged</Badge>
                            <Badge variant="red">NCNS: 1 agent → replacement search active</Badge>
                        </div>
                    </div>
                </Card>

                <AttendanceGrid agents={mockAgents} />

                {/* Bradford Factor summary */}
                <Card>
                    <h3 className="text-sm font-semibold mb-3">Bradford Factor — Absence Pattern Flags</h3>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="rounded-lg border border-surface-border p-3">
                            <p className="text-xs text-brand-gray">Ryan Costa</p>
                            <p className="text-lg font-bold text-status-red">186</p>
                            <p className="text-xs text-brand-gray">3 spells × 8 days — return-to-work interview required</p>
                            <Badge variant="red" className="mt-1">Mon/Fri pattern detected</Badge>
                        </div>
                        <div className="rounded-lg border border-surface-border p-3">
                            <p className="text-xs text-brand-gray">Priya Sharma</p>
                            <p className="text-lg font-bold text-status-amber">72</p>
                            <p className="text-xs text-brand-gray">2 spells × 3 days — return-to-work conversation prompt</p>
                        </div>
                        <div className="rounded-lg border border-surface-border p-3">
                            <p className="text-xs text-brand-gray">Quinn Davis</p>
                            <p className="text-lg font-bold text-status-green">24</p>
                            <p className="text-xs text-brand-gray">1 spell × 2 days — no action required</p>
                        </div>
                    </div>
                </Card>

                <AiFeatureLock title="Predictive Absence Risk" description="AI model predicts which agents are likely to be absent tomorrow based on historical patterns, weather, and day-of-week clustering" />
            </div>
        </DashboardTemplate>
    )
}
