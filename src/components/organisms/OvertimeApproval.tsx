'use client'

import { Card } from '@/components/atoms/Card'
import { Button } from '@/components/atoms/Button'
import { Badge } from '@/components/atoms/Badge'
import { DataRow } from '@/components/molecules/DataRow'
import { Clock, AlertTriangle, Check, X } from 'lucide-react'

interface OvertimeRequest {
    id: string
    agentName: string
    date: string
    startTime: string
    endTime: string
    hours: number
    cost: number
    rateMultiplier: number
    slaPenaltyRisk: number
    reason: string
}

interface OvertimeApprovalProps {
    request: OvertimeRequest
    onApprove?: (id: string) => void
    onDecline?: (id: string) => void
}

export function OvertimeApproval({ request, onApprove, onDecline }: OvertimeApprovalProps) {
    const costSavesMore = request.cost < request.slaPenaltyRisk

    return (
        <Card className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Clock size={16} className="text-brand-gray" />
                    <h3 className="text-sm font-semibold">Overtime Request</h3>
                </div>
                <Badge variant={costSavesMore ? 'green' : 'amber'}>
                    {costSavesMore ? 'Cost Effective' : 'Review Cost'}
                </Badge>
            </div>

            <DataRow label="Agent" value={request.agentName} />
            <DataRow label="Date" value={request.date} />
            <DataRow
                label="Time"
                value={`${request.startTime} — ${request.endTime} (${request.hours}h)`}
            />
            <DataRow
                label="Rate"
                value={<Badge variant="grey">{request.rateMultiplier}× multiplier</Badge>}
            />
            <DataRow label="Reason" value={request.reason} />

            <div className="rounded-lg bg-surface-muted p-3 space-y-2">
                <p className="text-xs font-medium uppercase tracking-wider text-brand-gray">Cost vs SLA Risk</p>
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                        <p className="text-xs text-brand-gray">OT Cost</p>
                        <p className="text-lg font-bold">£{request.cost.toFixed(2)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-brand-gray flex items-center justify-center gap-1">
                            <AlertTriangle size={12} className="text-status-amber" />
                            SLA Penalty Risk
                        </p>
                        <p className="text-lg font-bold text-status-red">£{request.slaPenaltyRisk.toFixed(2)}</p>
                    </div>
                </div>
            </div>

            <div className="flex gap-3">
                <Button variant="primary" className="flex-1" onClick={() => onApprove?.(request.id)}>
                    <Check size={14} />
                    Approve
                </Button>
                <Button variant="danger" className="flex-1" onClick={() => onDecline?.(request.id)}>
                    <X size={14} />
                    Decline
                </Button>
            </div>
        </Card>
    )
}
