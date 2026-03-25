'use client'

import { useState } from 'react'
import { DashboardTemplate } from '@/components/templates/DashboardTemplate'
import { LeaveCapacityCalendar } from '@/components/organisms/LeaveCapacityCalendar'
import { SmartLeavePush } from '@/components/organisms/SmartLeavePush'
import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import { StatCard } from '@/components/molecules/StatCard'
import type { LeaveCapacityWeek, LeaveRequest } from '@/types/leave'

const mockWeeks: LeaveCapacityWeek[] = [
    { weekNumber: 13, startDate: '2026-03-23', slotsAvailable: 4, slotsUsed: 3, slotsRemaining: 1, status: 'amber', volumeForecastDelta: 2, smartPushActive: false },
    { weekNumber: 14, startDate: '2026-03-30', slotsAvailable: 4, slotsUsed: 4, slotsRemaining: 0, status: 'red', volumeForecastDelta: 5, smartPushActive: false },
    { weekNumber: 15, startDate: '2026-04-06', slotsAvailable: 5, slotsUsed: 1, slotsRemaining: 4, status: 'green', volumeForecastDelta: -12, smartPushActive: true },
    { weekNumber: 16, startDate: '2026-04-13', slotsAvailable: 5, slotsUsed: 2, slotsRemaining: 3, status: 'green', volumeForecastDelta: -3, smartPushActive: false },
    { weekNumber: 17, startDate: '2026-04-20', slotsAvailable: 4, slotsUsed: 2, slotsRemaining: 2, status: 'green', volumeForecastDelta: 0, smartPushActive: false },
    { weekNumber: 18, startDate: '2026-04-27', slotsAvailable: 4, slotsUsed: 3, slotsRemaining: 1, status: 'amber', volumeForecastDelta: 8, smartPushActive: false },
    { weekNumber: 19, startDate: '2026-05-04', slotsAvailable: 5, slotsUsed: 1, slotsRemaining: 4, status: 'green', volumeForecastDelta: -5, smartPushActive: false },
    { weekNumber: 20, startDate: '2026-05-11', slotsAvailable: 5, slotsUsed: 0, slotsRemaining: 5, status: 'green', volumeForecastDelta: -8, smartPushActive: false },
]

const smartPushWeek = mockWeeks.find((w) => w.smartPushActive)!

const suggestedAgents = [
    { name: 'Karen Müller', leaveBalance: 14 },
    { name: 'Oscar Tran', leaveBalance: 11 },
    { name: 'Ella Brooks', leaveBalance: 9 },
]

const mockRequests: LeaveRequest[] = [
    { id: 'lr-001', agentId: 'Alice Monroe', type: 'paid', startDate: '2026-03-30', endDate: '2026-04-03', daysRequested: 5, status: 'approved', approvedBy: 'Team Lead' },
    { id: 'lr-002', agentId: 'Ben Carter', type: 'sick', startDate: '2026-03-25', endDate: '2026-03-26', daysRequested: 2, status: 'approved' },
    { id: 'lr-003', agentId: 'Daniel Reyes', type: 'paid', startDate: '2026-03-30', endDate: '2026-04-01', daysRequested: 3, status: 'blocked', blockReason: 'Week 14 at capacity', alternativeDates: ['2026-04-06', '2026-04-13'] },
    { id: 'lr-004', agentId: 'Grace Kim', type: 'training', startDate: '2026-04-08', endDate: '2026-04-08', daysRequested: 1, status: 'pending' },
    { id: 'lr-005', agentId: 'Hasan Ali', type: 'paid', startDate: '2026-04-14', endDate: '2026-04-17', daysRequested: 4, status: 'pending' },
]

const statusVariant: Record<string, 'green' | 'amber' | 'red' | 'grey'> = {
    approved: 'green',
    pending: 'amber',
    blocked: 'red',
    cancelled: 'grey',
}

export default function LeavePage() {
    const [requests] = useState(mockRequests)

    const pending = requests.filter((r) => r.status === 'pending').length
    const approved = requests.filter((r) => r.status === 'approved').length
    const blocked = requests.filter((r) => r.status === 'blocked').length

    return (
        <DashboardTemplate
            title="Leave Management"
            statCards={
                <>
                    <StatCard label="Pending Requests" value={pending} variant="amber" />
                    <StatCard label="Approved" value={approved} variant="green" />
                    <StatCard label="Blocked" value={blocked} variant="red" />
                    <StatCard label="Total Requests" value={requests.length} variant="default" />
                </>
            }
            actions={
                <Button size="sm">Submit Leave Request</Button>
            }
        >
            <div className="space-y-6">
                <LeaveCapacityCalendar weeks={mockWeeks} />

                {smartPushWeek && (
                    <SmartLeavePush
                        week={smartPushWeek}
                        suggestedAgents={suggestedAgents}
                    />
                )}

                <Card>
                    <h2 className="mb-4 text-sm font-semibold">Leave Requests</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-surface-border text-left text-xs text-brand-gray">
                                    <th className="pb-3 pr-4 font-medium">Agent</th>
                                    <th className="pb-3 pr-4 font-medium">Type</th>
                                    <th className="pb-3 pr-4 font-medium">Dates</th>
                                    <th className="pb-3 pr-4 font-medium">Days</th>
                                    <th className="pb-3 pr-4 font-medium">Status</th>
                                    <th className="pb-3 font-medium">Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map((req) => (
                                    <tr key={req.id} className="border-b border-surface-border last:border-0">
                                        <td className="py-3 pr-4 font-medium">{req.agentId}</td>
                                        <td className="py-3 pr-4 capitalize">{req.type}</td>
                                        <td className="py-3 pr-4">
                                            {req.startDate} — {req.endDate}
                                        </td>
                                        <td className="py-3 pr-4">{req.daysRequested}</td>
                                        <td className="py-3 pr-4">
                                            <Badge variant={statusVariant[req.status]}>
                                                {req.status.toUpperCase()}
                                            </Badge>
                                        </td>
                                        <td className="py-3 text-xs text-brand-gray">
                                            {req.blockReason && (
                                                <span>
                                                    {req.blockReason}
                                                    {req.alternativeDates && (
                                                        <span className="ml-1 text-brand-green">
                                                            Alt: {req.alternativeDates.join(', ')}
                                                        </span>
                                                    )}
                                                </span>
                                            )}
                                            {req.approvedBy && <span>Approved by {req.approvedBy}</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </DashboardTemplate>
    )
}
