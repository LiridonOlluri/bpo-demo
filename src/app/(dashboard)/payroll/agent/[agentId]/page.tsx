'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { DetailTemplate } from '@/components/templates/DetailTemplate'
import { Button } from '@/components/atoms/Button'
import { Card } from '@/components/atoms/Card'
import { DataRow } from '@/components/molecules/DataRow'
import { Badge } from '@/components/atoms/Badge'

const mockPayslip = {
    agentName: 'Ana Lopez',
    agentId: 'ag-001',
    period: 'March 2026',
    team: 'Team A',
    role: 'Customer Service Agent',
    baseHours: 176,
    hourlyRate: 12.0,
    basePay: 2112.0,
    overtimeHours: 12,
    overtimeRate: 15.0,
    overtimeCost: 180.0,
    nightDiffHours: 40,
    nightDiffPremium: '10%',
    nightDiffCost: 48.0,
    tardinessMinutes: 0,
    tardinessDeduction: 0,
    paidLeaveDays: 0,
    paidLeaveAmount: 0,
    unpaidLeaveDays: 0,
    attendanceBonus: 50.0,
    qaBonus: 75.0,
    grossPay: 2465.0,
    sssContribution: 135.0,
    philhealthContribution: 75.0,
    pagibigContribution: 100.0,
    taxWithheld: 198.5,
    netPay: 1956.5,
}

export default function AgentPayslipPage({ params }: { params: Promise<{ agentId: string }> }) {
    const { agentId } = React.use(params)

    return (
        <div className="space-y-6">
            <Link href="/payroll">
                <Button variant="ghost" size="sm">
                    <ArrowLeft size={16} />
                    Back to Payroll
                </Button>
            </Link>

            <DetailTemplate
                title={`Payslip — ${mockPayslip.agentName}`}
                actions={<Badge variant="green">Approved</Badge>}
                sidebar={
                    <Card>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-gray">Summary</h3>
                        <DataRow label="Agent ID" value={agentId} />
                        <DataRow label="Period" value={mockPayslip.period} />
                        <DataRow label="Team" value={mockPayslip.team} />
                        <DataRow label="Role" value={mockPayslip.role} />
                        <DataRow label="Net Pay" value={<span className="text-lg font-bold">${mockPayslip.netPay.toFixed(2)}</span>} />
                    </Card>
                }
            >
                <div className="space-y-6">
                    <Card>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-gray">Earnings</h3>
                        <DataRow label="Base Hours" value={`${mockPayslip.baseHours} hrs`} />
                        <DataRow label="Hourly Rate" value={`$${mockPayslip.hourlyRate.toFixed(2)}`} />
                        <DataRow label="Base Pay" value={`$${mockPayslip.basePay.toFixed(2)}`} />
                        <DataRow label="Overtime Hours" value={`${mockPayslip.overtimeHours} hrs`} />
                        <DataRow label="Overtime Rate" value={`$${mockPayslip.overtimeRate.toFixed(2)}/hr`} />
                        <DataRow label="Overtime Pay" value={`$${mockPayslip.overtimeCost.toFixed(2)}`} />
                        <DataRow label="Night Diff Hours" value={`${mockPayslip.nightDiffHours} hrs`} />
                        <DataRow label="Night Diff Premium" value={mockPayslip.nightDiffPremium} />
                        <DataRow label="Night Diff Pay" value={`$${mockPayslip.nightDiffCost.toFixed(2)}`} />
                    </Card>

                    <Card>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-gray">Bonuses</h3>
                        <DataRow label="Attendance Bonus" value={`$${mockPayslip.attendanceBonus.toFixed(2)}`} />
                        <DataRow label="QA Bonus" value={`$${mockPayslip.qaBonus.toFixed(2)}`} />
                    </Card>

                    <Card>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-gray">Deductions</h3>
                        <DataRow label={`Tardiness (${mockPayslip.tardinessMinutes} min)`} value={`-$${mockPayslip.tardinessDeduction.toFixed(2)}`} />
                        <DataRow label="SSS Contribution" value={`-$${mockPayslip.sssContribution.toFixed(2)}`} />
                        <DataRow label="PhilHealth" value={`-$${mockPayslip.philhealthContribution.toFixed(2)}`} />
                        <DataRow label="Pag-IBIG" value={`-$${mockPayslip.pagibigContribution.toFixed(2)}`} />
                        <DataRow label="Tax Withheld" value={`-$${mockPayslip.taxWithheld.toFixed(2)}`} />
                    </Card>

                    <Card>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-gray">Totals</h3>
                        <DataRow label="Gross Pay" value={`$${mockPayslip.grossPay.toFixed(2)}`} />
                        <DataRow label="Total Deductions" value={`-$${(mockPayslip.grossPay - mockPayslip.netPay).toFixed(2)}`} />
                        <DataRow label="Net Pay" value={<span className="font-bold text-brand-green">${mockPayslip.netPay.toFixed(2)}</span>} />
                    </Card>
                </div>
            </DetailTemplate>
        </div>
    )
}
