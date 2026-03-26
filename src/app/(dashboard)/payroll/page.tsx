'use client'

import { useState } from 'react'
import { DashboardTemplate } from '@/components/templates/DashboardTemplate'
import { StatCard } from '@/components/molecules/StatCard'
import { Select } from '@/components/atoms/Select'
import { Button } from '@/components/atoms/Button'
import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import { PayrollSummaryTable } from '@/components/organisms/PayrollSummaryTable'
import { AiFeatureLock } from '@/components/molecules/AiFeatureLock'
import type { PayrollLine } from '@/types/payroll'

const periods = [
    { value: '2026-03', label: 'March 2026' },
    { value: '2026-02', label: 'February 2026' },
]

// EUR 800/month fully loaded, OT rate 1.5x, Night diff +15% for 22:00-00:00
// Hourly rate: EUR 800 / 176h ≈ EUR 4.55/h
const HOURLY_RATE = 4.55

function makeLine(name: string, id: string, base: number, ot: number, nightH: number, tardMin: number, paidLeave: number, unpaidLeave: number, attBonus: boolean, qaBonus: boolean, client: string): PayrollLine {
    const otRate = 1.5
    const otCost = ot * HOURLY_RATE * otRate
    const nightCost = nightH * HOURLY_RATE * 0.15
    const tardDeduct = tardMin * (HOURLY_RATE / 60)
    const attBonusAmt = attBonus ? 25 : 0
    const qaBonusAmt = qaBonus ? 35 : 0
    const paidLeaveAmt = paidLeave * (HOURLY_RATE * 8)
    const gross = base * HOURLY_RATE + otCost + nightCost - tardDeduct + attBonusAmt + qaBonusAmt + paidLeaveAmt

    return {
        agentId: id,
        agentName: name,
        period: '2026-03',
        baseHours: base,
        overtimeHours: ot,
        overtimeRate: otRate,
        overtimeCost: parseFloat(otCost.toFixed(2)),
        nightDiffHours: nightH,
        nightDiffPremium: 0.15,
        nightDiffCost: parseFloat(nightCost.toFixed(2)),
        tardinessDeductionMinutes: tardMin,
        tardinessDeductionAmount: parseFloat(tardDeduct.toFixed(2)),
        paidLeaveDays: paidLeave,
        paidLeaveAmount: parseFloat(paidLeaveAmt.toFixed(2)),
        unpaidLeaveDays: unpaidLeave,
        attendanceBonusEligible: attBonus,
        attendanceBonusAmount: attBonusAmt,
        qaBonusEligible: qaBonus,
        qaBonusAmount: qaBonusAmt,
        grossPay: parseFloat(gross.toFixed(2)),
        clientAllocation: [
            { clientId: client, percentage: 100, cost: parseFloat(gross.toFixed(2)) },
        ],
    }
}

// 10 sample agents across the 5 teams (2 per team)
const mockLines: PayrollLine[] = [
    makeLine('Alice Monroe', 'a01', 176, 8, 0, 0, 0, 0, true, true, 'client-a'),
    makeLine('Ben Carter', 'a02', 176, 4, 0, 7, 0, 0, false, true, 'client-a'),
    makeLine('Ella Brooks', 'a05', 168, 0, 16, 0, 1, 0, true, false, 'client-a'),
    makeLine('Frank Osei', 'a06', 176, 12, 0, 12, 0, 0, false, false, 'client-a'),
    makeLine('Isla Novak', 'a09', 176, 0, 0, 0, 0, 0, true, true, 'client-a'),
    makeLine('James Patel', 'a10', 176, 6, 0, 0, 0, 0, true, true, 'client-a'),
    makeLine('Karen Müller', 'a11', 176, 2, 32, 0, 0, 0, true, false, 'client-a'),
    makeLine('Oscar Tran', 'a15', 176, 0, 32, 0, 0, 0, false, true, 'client-b'),
    makeLine('Priya Sharma', 'a16', 168, 0, 0, 22, 0, 1, false, false, 'client-b'),
    makeLine('Quinn Davis', 'a17', 176, 10, 32, 14, 0, 0, false, false, 'client-b'),
]

export default function PayrollPage() {
    const [period, setPeriod] = useState('2026-03')
    const [approvalStatus, setApprovalStatus] = useState<'pending' | 'approved'>('pending')

    const totalGross = mockLines.reduce((s, l) => s + l.grossPay, 0)
    const totalOt = mockLines.reduce((s, l) => s + l.overtimeCost, 0)
    const totalDeductions = mockLines.reduce((s, l) => s + l.tardinessDeductionAmount, 0)
    const totalNightDiff = mockLines.reduce((s, l) => s + l.nightDiffCost, 0)

    return (
        <DashboardTemplate
            title={`Payroll — UC-4D${approvalStatus === 'approved' ? ' ✓ Approved' : ''}`}
            actions={
                <div className="flex items-center gap-3">
                    <Select
                        options={periods}
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className="w-44"
                    />
                    {approvalStatus === 'pending' ? (
                        <Button onClick={() => {
                            setApprovalStatus('approved')
                            if (typeof window !== 'undefined') {
                                import('sonner').then(({ toast }) => toast.success('Payroll approved', { description: 'March 2026 payroll approved. Export to ADP triggered. 100 Work Invoice PDFs queued.' }))
                            }
                        }}>
                            One-Click Approve
                        </Button>
                    ) : (
                        <Button variant="ghost" className="text-status-green">
                            ✓ Approved — Exported to ADP
                        </Button>
                    )}
                </div>
            }
            statCards={
                <>
                    <StatCard label="Total Gross" value={`€${totalGross.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
                    <StatCard label="Total OT Cost" value={`€${totalOt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} variant="amber" />
                    <StatCard label="Night Differential" value={`€${totalNightDiff.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
                    <StatCard label="Tardiness Deductions" value={`€${totalDeductions.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} variant="red" />
                </>
            }
        >
            {/* UC-4D description */}
            {approvalStatus === 'pending' && (
                <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm">
                    <span className="font-medium">UC-4D — Finance Director view:</span> All calculations auto-generated from attendance. Base hours, OT, tardiness deductions, night diff, bonuses, missing minutes compensation, leave deductions — per agent. Review the table below, then click <strong>One-Click Approve</strong> to finalise and export to ADP. Per-agent Work Invoice PDFs will be available for download.
                    <br /><span className="text-brand-gray text-xs mt-1 block">Replaces 2–3 days of manual reconciliation between Interflex, ADP, and Excel.</span>
                </div>
            )}
            {approvalStatus === 'approved' && (
                <div className="mb-4 rounded-lg border border-status-green/30 bg-status-green/5 p-3 text-sm">
                    <span className="font-semibold text-status-green">✓ Payroll approved — March 2026.</span> Exported to ADP. 100 Work Invoice PDFs queued for agent self-service download. Missing minutes: compensation balances updated. Night differential applied to 3 agents (22:00–00:00).
                </div>
            )}

            {/* Payroll config summary */}
            <Card className="mb-4">
                <div className="flex flex-wrap gap-4 text-xs">
                    <span className="text-brand-gray">Rate: <span className="font-medium text-foreground">€{HOURLY_RATE}/h</span></span>
                    <span className="text-brand-gray">OT Multiplier: <span className="font-medium text-foreground">1.5×</span></span>
                    <span className="text-brand-gray">Night Diff: <span className="font-medium text-foreground">+15% (22:00-00:00)</span></span>
                    <span className="text-brand-gray">Contract: <span className="font-medium text-foreground">6-month fixed-term</span></span>
                    <span className="text-brand-gray">Cost/Agent/Month: <span className="font-medium text-foreground">€800 fully loaded</span></span>
                </div>
            </Card>

            <PayrollSummaryTable lines={mockLines} />

            {/* Client cost allocation */}
            <Card className="mt-6">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-gray">Cost Allocation by Client</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border border-surface-border p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">Client A (E-commerce)</span>
                            <Badge variant="green">per-minute</Badge>
                        </div>
                        <p className="text-2xl font-bold">€{mockLines.filter(l => l.clientAllocation[0].clientId === 'client-a').reduce((s, l) => s + l.grossPay, 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        <p className="text-xs text-brand-gray mt-1">35 agents assigned — 7 shown in sample</p>
                    </div>
                    <div className="rounded-lg border border-surface-border p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">Client B (Tech Support)</span>
                            <Badge variant="blue">per-FTE</Badge>
                        </div>
                        <p className="text-2xl font-bold">€{mockLines.filter(l => l.clientAllocation[0].clientId === 'client-b').reduce((s, l) => s + l.grossPay, 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        <p className="text-xs text-brand-gray mt-1">15 agents assigned — 3 shown in sample</p>
                    </div>
                </div>
            </Card>

            <AiFeatureLock title="Earnings Simulator" description="What-if calculator: agents see how OT, bonuses, and deductions would affect their pay before the period ends" />
        </DashboardTemplate>
    )
}
