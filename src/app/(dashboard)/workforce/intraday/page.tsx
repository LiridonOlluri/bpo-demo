'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { DashboardTemplate } from '@/components/templates/DashboardTemplate'
import { StaffingGapChart } from '@/components/organisms/StaffingGapChart'
import { OvertimeApproval } from '@/components/organisms/OvertimeApproval'
import { BreakMoveAlert } from '@/components/organisms/BreakMoveAlert'
import { AlertBanner } from '@/components/molecules/AlertBanner'
import { StatCard } from '@/components/molecules/StatCard'
import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'

const mockIntradayData = [
    { time: '08:00', requiredAgents: 12, scheduledAgents: 12, actualAgents: 11 },
    { time: '08:30', requiredAgents: 14, scheduledAgents: 13, actualAgents: 12 },
    { time: '09:00', requiredAgents: 16, scheduledAgents: 15, actualAgents: 13 },
    { time: '09:30', requiredAgents: 18, scheduledAgents: 16, actualAgents: 15 },
    { time: '10:00', requiredAgents: 20, scheduledAgents: 18, actualAgents: 17 },
    { time: '10:30', requiredAgents: 22, scheduledAgents: 20, actualAgents: 18 },
    { time: '11:00', requiredAgents: 24, scheduledAgents: 22, actualAgents: 20 },
    { time: '11:30', requiredAgents: 22, scheduledAgents: 22, actualAgents: 21 },
    { time: '12:00', requiredAgents: 20, scheduledAgents: 20, actualAgents: 19 },
    { time: '12:30', requiredAgents: 18, scheduledAgents: 18, actualAgents: 18 },
    { time: '13:00', requiredAgents: 16, scheduledAgents: 16, actualAgents: 16 },
    { time: '13:30', requiredAgents: 18, scheduledAgents: 17, actualAgents: 16 },
    { time: '14:00', requiredAgents: 20, scheduledAgents: 19, actualAgents: 18 },
    { time: '14:30', requiredAgents: 18, scheduledAgents: 18, actualAgents: 17 },
    { time: '15:00', requiredAgents: 16, scheduledAgents: 15, actualAgents: 15 },
    { time: '15:30', requiredAgents: 14, scheduledAgents: 14, actualAgents: 14 },
]

const mockOtRequest = {
    id: 'ot-001',
    agentName: 'Clara Singh',
    date: '2026-03-25',
    startTime: '17:30',
    endTime: '19:30',
    hours: 2,
    cost: 48.50,
    rateMultiplier: 1.5,
    slaPenaltyRisk: 320.00,
    reason: 'Staffing gap 10:00–11:00 — 4 agents under requirement',
}

const BREAK_MOVE_SUGGESTION = {
    originalTime: '11:30',
    newTime: '11:45',
    reason: 'SL dropped to 78% at 11:15 — volume peak active',
    slRecovery: '71% → 82%',
}

const REALLOCATION_AGENTS = [
    { id: 'a15', name: 'Agent #15 — Oscar Tran', fromClient: 'Client A', toClient: 'Client B', cert: 'Client B cert valid', dataSep: 'Data separation cleared', hours: '14:00–18:00' },
    { id: 'a29', name: 'Agent #29 — Priya Sharma', fromClient: 'Client A', toClient: 'Client B', cert: 'Client B cert valid', dataSep: 'Data separation cleared', hours: '14:00–18:00' },
]

export default function IntradayPage() {
    const [otStatus, setOtStatus] = useState<'pending' | 'approved' | 'declined'>('pending')
    const [breakStatus, setBreakStatus] = useState<'pending' | 'approved' | 'declined'>('pending')
    const [reallocStatus, setReallocStatus] = useState<'pending' | 'approved' | 'declined'>('pending')

    const gap = mockIntradayData.reduce((worst, d) => {
        const diff = d.requiredAgents - d.actualAgents
        return diff > worst.diff ? { diff, time: d.time } : worst
    }, { diff: 0, time: '' })

    return (
        <DashboardTemplate
            title="Intraday Staffing"
            statCards={
                <>
                    <StatCard label="Current Interval" value="10:00–10:30" variant="default" />
                    <StatCard label="Required" value={20} variant="default" />
                    <StatCard label="Actual" value={17} variant="red" />
                    <StatCard label="Largest Gap" value={`${gap.diff} @ ${gap.time}`} variant="amber" />
                </>
            }
        >
            <div className="space-y-6">
                {gap.diff >= 3 && (
                    <AlertBanner
                        variant="red"
                        message={`Staffing gap of ${gap.diff} agents detected at ${gap.time}. Consider approving overtime or reallocating breaks.`}
                    />
                )}

                <Card>
                    <h2 className="mb-4 text-sm font-semibold">Live Interval Staffing</h2>
                    <StaffingGapChart data={mockIntradayData} />
                </Card>

                {otStatus === 'pending' && (
                    <OvertimeApproval
                        request={mockOtRequest}
                        onApprove={() => setOtStatus('approved')}
                        onDecline={() => setOtStatus('declined')}
                    />
                )}

                {otStatus === 'approved' && (
                    <AlertBanner variant="amber" message="Overtime request for Clara Singh approved — schedule updated." dismissible />
                )}
                {otStatus === 'declined' && (
                    <AlertBanner variant="amber" message="Overtime request for Clara Singh declined." dismissible />
                )}

                {/* UC-3C — Cross-Client Agent Reallocation */}
                <Card>
                    <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-gray">Cross-Client Agent Reallocation — UC-3C</h2>
                    <p className="text-xs text-brand-gray mb-4">
                        Client B understaffed (volume spike +22%). Client A overstaffed (occupancy 68%). 2 agents on Client A are cross-trained and certified for Client B. Cert check + data separation: passed.
                    </p>
                    {reallocStatus === 'pending' && (
                        <div className="space-y-3">
                            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 space-y-2">
                                {REALLOCATION_AGENTS.map((a) => (
                                    <div key={a.id} className="flex flex-wrap items-center gap-2 text-xs">
                                        <span className="font-medium">{a.name}</span>
                                        <Badge variant="grey">{a.fromClient}</Badge>
                                        <span className="text-brand-gray">→</span>
                                        <Badge variant="blue">{a.toClient}</Badge>
                                        <span className="text-brand-gray">{a.hours}</span>
                                        <Badge variant="green">{a.cert}</Badge>
                                        <Badge variant="green">{a.dataSep}</Badge>
                                    </div>
                                ))}
                            </div>
                            <div className="rounded-lg border border-surface-border p-2 text-xs text-brand-gray">
                                <strong>Why meTru is different:</strong> &quot;Interflex can&apos;t check certs. Calabrio can&apos;t check compliance. meTru checks both in one second.&quot;
                            </div>
                            <div className="flex gap-2">
                                <Button size="sm" onClick={() => { setReallocStatus('approved'); toast.success('Reallocation approved', { description: '2 agents temporarily moved to Client B 14:00–18:00. Client A schedule adjusted.' }) }}>
                                    Approve temporary reallocation
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => { setReallocStatus('declined'); toast.info('Reallocation declined') }}>
                                    Decline
                                </Button>
                            </div>
                        </div>
                    )}
                    {reallocStatus === 'approved' && (
                        <AlertBanner variant="amber" message="Agent #15 and #29 reallocated to Client B 14:00–18:00. Client A schedule adjusted. Client B SL expected to recover to 82%." />
                    )}
                    {reallocStatus === 'declined' && (
                        <AlertBanner variant="amber" message="Reallocation declined. Client B staffing gap remains. Consider OT." />
                    )}
                </Card>

                {/* UC-3F / UC-X2 — Break flexibility (BreakMoveAlert) */}
                <Card>
                    <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-gray">Break Flexibility — SL Recovery (UC-3F)</h2>
                    <p className="text-xs text-brand-gray mb-3">
                        SL dropped to 78% at 11:15. System detected 3 agents scheduled for break at 11:30.
                        Recommendation: delay breaks by 15 min to 11:45. Projected SL recovery: <strong>{BREAK_MOVE_SUGGESTION.slRecovery}</strong>.
                    </p>
                    {breakStatus === 'pending' && (
                        <div className="space-y-3">
                            <div className="rounded-lg border border-status-amber/30 bg-status-amber/5 p-3 text-sm">
                                <p className="font-medium">System recommendation</p>
                                <p className="text-xs text-brand-gray mt-1">
                                    Move 3 agents&apos; breaks from <strong>{BREAK_MOVE_SUGGESTION.originalTime}</strong> to <strong>{BREAK_MOVE_SUGGESTION.newTime}</strong> — {BREAK_MOVE_SUGGESTION.reason}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button size="sm" onClick={() => { setBreakStatus('approved'); toast.success('Breaks moved to 11:45', { description: 'Agents notified: "Break moved to 11:45 — volume peak."' }) }}>
                                    Approve — Move breaks to 11:45
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => { setBreakStatus('declined'); toast.info('Break move declined') }}>
                                    Decline
                                </Button>
                            </div>
                        </div>
                    )}
                    {breakStatus === 'approved' && (
                        <div className="space-y-2">
                            <BreakMoveAlert agentName="Clara Singh, Isla Novak, Oscar Tran" originalTime={BREAK_MOVE_SUGGESTION.originalTime} newTime={BREAK_MOVE_SUGGESTION.newTime} reason={BREAK_MOVE_SUGGESTION.reason} />
                            <AlertBanner variant="amber" message={`SL recovering — expected to reach 82% by ${BREAK_MOVE_SUGGESTION.newTime}. All 3 agents notified.`} />
                        </div>
                    )}
                    {breakStatus === 'declined' && (
                        <AlertBanner variant="amber" message="Break move declined. SL remains at risk for 11:15–11:45 interval." />
                    )}
                </Card>
            </div>
        </DashboardTemplate>
    )
}
