'use client'

import { useState } from 'react'
import { DashboardTemplate } from '@/components/templates/DashboardTemplate'
import { StaffingGapChart } from '@/components/organisms/StaffingGapChart'
import { OvertimeApproval } from '@/components/organisms/OvertimeApproval'
import { AlertBanner } from '@/components/molecules/AlertBanner'
import { StatCard } from '@/components/molecules/StatCard'
import { Card } from '@/components/atoms/Card'

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

export default function IntradayPage() {
    const [otStatus, setOtStatus] = useState<'pending' | 'approved' | 'declined'>('pending')

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
            </div>
        </DashboardTemplate>
    )
}
