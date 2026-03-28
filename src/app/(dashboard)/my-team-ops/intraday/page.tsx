'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import { StatCard } from '@/components/molecules/StatCard'
import { StaffingGapChart } from '@/components/organisms/StaffingGapChart'
import { CheckCircle2, Coffee } from 'lucide-react'

const mockIntradayData = [
    { time: '08:00', requiredAgents: 4, scheduledAgents: 4, actualAgents: 4 },
    { time: '08:30', requiredAgents: 5, scheduledAgents: 5, actualAgents: 4 },
    { time: '09:00', requiredAgents: 6, scheduledAgents: 5, actualAgents: 5 },
    { time: '09:30', requiredAgents: 7, scheduledAgents: 6, actualAgents: 5 },
    { time: '10:00', requiredAgents: 8, scheduledAgents: 7, actualAgents: 7 },
    { time: '10:30', requiredAgents: 8, scheduledAgents: 7, actualAgents: 7 },
    { time: '11:00', requiredAgents: 9, scheduledAgents: 8, actualAgents: 7 },
    { time: '11:30', requiredAgents: 8, scheduledAgents: 8, actualAgents: 7 },
    { time: '12:00', requiredAgents: 7, scheduledAgents: 7, actualAgents: 7 },
    { time: '12:30', requiredAgents: 6, scheduledAgents: 6, actualAgents: 6 },
    { time: '13:00', requiredAgents: 6, scheduledAgents: 6, actualAgents: 6 },
    { time: '13:30', requiredAgents: 7, scheduledAgents: 6, actualAgents: 6 },
    { time: '14:00', requiredAgents: 8, scheduledAgents: 7, actualAgents: 7 },
    { time: '14:30', requiredAgents: 7, scheduledAgents: 7, actualAgents: 6 },
    { time: '15:00', requiredAgents: 6, scheduledAgents: 6, actualAgents: 6 },
    { time: '15:30', requiredAgents: 5, scheduledAgents: 5, actualAgents: 5 },
]

export default function MyTeamIntradayPage() {
    const [otApproved, setOtApproved] = useState(false)
    const [breakMoved, setBreakMoved] = useState(false)

    const currentInterval = '11:00–11:30'
    const required = 9
    const actual = 7
    const gap = required - actual

    const handleApproveOT = () => {
        setOtApproved(true)
        toast.success('OT approved — Agent #28', {
            description: 'Agent #28 added to schedule for 2h OT. WFM recalculating. No cost shown at Level 2.',
        })
    }

    const handleApproveBreak = () => {
        setBreakMoved(true)
        toast.success('Breaks moved to 11:45', {
            description: 'Ella Brooks, Frank Osei, Grace Kim — break moved from 11:30 to 11:45. Break compliance still tracked. SL projected to recover to 82%.',
        })
    }

    return (
        <div className="space-y-5">
            <div className="mb-2">
                <h1 className="text-xl font-bold tracking-tight">My Team Operations — Intraday</h1>
                <p className="text-sm text-brand-gray">Own team only · OT requests (no EUR) · break flexibility · SL rescue</p>
            </div>

            {/* Current interval stats */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatCard label="Current Interval" value={currentInterval} variant="default" />
                <StatCard label="Required Agents" value={required} variant="default" />
                <StatCard label="Actual On Floor" value={actual} variant={actual < required ? 'amber' : 'green'} />
                <StatCard label="Gap" value={gap > 0 ? `-${gap}` : '0'} variant={gap > 0 ? 'red' : 'green'} trendValue={gap > 0 ? 'Below Erlang requirement' : 'Staffed as planned'} />
            </div>

            {/* SL drop + break flexibility — UC-2H */}
            {!breakMoved && (
                <Card className="border-amber-200 bg-amber-50/40">
                    <div className="flex items-start gap-3">
                        <Coffee size={16} className="text-amber-600 mt-0.5 shrink-0" />
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-amber-700">Break Flexibility Recommendation — UC-2H</p>
                            <p className="mt-1 text-xs text-amber-600">
                                SL dropped to 76% at 11:15. 3 agents scheduled for break at 11:30 (Ella Brooks, Frank Osei, Grace Kim).
                                Shift breaks from 11:30 → 11:45. Projected SL recovery: 77% → 82%.
                            </p>
                        </div>
                        <Button size="sm" onClick={handleApproveBreak}>
                            <CheckCircle2 size={13} /> Approve — Move breaks to 11:45
                        </Button>
                    </div>
                </Card>
            )}
            {breakMoved && (
                <div className="flex items-center gap-3 rounded-lg bg-status-green/10 px-4 py-3 text-sm text-status-green">
                    <CheckCircle2 size={16} className="shrink-0" />
                    <span>Breaks moved to 11:45. Ella Brooks, Frank Osei, Grace Kim notified. Break compliance tracked. SL recovered to 82% within 15 min.</span>
                </div>
            )}

            {/* OT Approval — NO EUR */}
            <Card>
                <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-sm font-semibold">OT Requests</h2>
                    <span className="text-[10px] rounded border border-green-200 bg-green-50 px-2 py-0.5 text-green-700 font-medium">Hours only · NO EUR cost</span>
                </div>
                {!otApproved ? (
                    <div className="rounded-lg border border-surface-border p-3 text-sm">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="font-medium">Agent #28 — available for 2h OT</p>
                                <p className="text-xs text-brand-gray mt-0.5">Today 17:30–19:30 · currently off-duty · covers 11:00–13:00 gap</p>
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    <Badge variant="green">Available</Badge>
                                    <Badge variant="blue">Voice · Client A certified</Badge>
                                    <Badge variant="grey">OT eligible (missing min: 0)</Badge>
                                </div>
                            </div>
                            <div className="text-right shrink-0">
                                <p className="text-2xl font-bold">2h</p>
                                <p className="text-xs text-brand-gray">OT hours</p>
                                <p className="text-[11px] text-brand-gray mt-1 italic">Cost shown at Level 3+</p>
                            </div>
                        </div>
                        <Button size="sm" className="mt-3" onClick={handleApproveOT}>
                            <CheckCircle2 size={13} /> Approve OT
                        </Button>
                    </div>
                ) : (
                    <div className="flex items-center gap-3 rounded-lg bg-status-green/10 px-4 py-3 text-sm text-status-green">
                        <CheckCircle2 size={16} className="shrink-0" />
                        <span>Agent #28 OT approved. Added to schedule 17:30–19:30. WFM recalculated. SL projection updated.</span>
                    </div>
                )}
            </Card>

            {/* Live interval chart */}
            <Card>
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-gray">Live Staffing — Own Team Contribution</h2>
                    <Badge variant="amber">11:00 — gap: 2 agents below Erlang</Badge>
                </div>
                <StaffingGapChart data={mockIntradayData} />
                <p className="mt-2 text-xs text-brand-gray">
                    Chart shows required (Erlang-C), scheduled, and actual agents per 30-min interval for your team only.
                </p>
            </Card>
        </div>
    )
}
