'use client'

import { useMemo, useState } from 'react'
import { ArrowDownWideNarrow } from 'lucide-react'
import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import type { PayrollLine } from '@/types/payroll'

interface PayrollSummaryTableProps {
    lines: PayrollLine[]
}

function currency(value: number) {
    return value.toLocaleString(undefined, { style: 'currency', currency: 'USD' })
}

export function PayrollSummaryTable({ lines }: PayrollSummaryTableProps) {
    const [sortDesc, setSortDesc] = useState(true)

    const sorted = useMemo(
        () => [...lines].sort((a, b) => (sortDesc ? b.grossPay - a.grossPay : a.grossPay - b.grossPay)),
        [lines, sortDesc]
    )

    const totals = useMemo(() => {
        return lines.reduce(
            (acc, l) => ({
                baseHours: acc.baseHours + l.baseHours,
                otHours: acc.otHours + l.overtimeHours,
                otCost: acc.otCost + l.overtimeCost,
                nightDiff: acc.nightDiff + l.nightDiffCost,
                deductions: acc.deductions + l.tardinessDeductionAmount,
                bonuses: acc.bonuses + l.attendanceBonusAmount + l.qaBonusAmount,
                grossPay: acc.grossPay + l.grossPay,
            }),
            { baseHours: 0, otHours: 0, otCost: 0, nightDiff: 0, deductions: 0, bonuses: 0, grossPay: 0 }
        )
    }, [lines])

    return (
        <Card padding={false}>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-surface-border text-left text-xs text-brand-gray">
                            <th className="p-4 font-medium">Agent</th>
                            <th className="p-4 font-medium">Base Hours</th>
                            <th className="p-4 font-medium">OT Hours</th>
                            <th className="p-4 font-medium">OT Cost</th>
                            <th className="p-4 font-medium">Night Diff</th>
                            <th className="p-4 font-medium">Deductions</th>
                            <th className="p-4 font-medium">Bonuses</th>
                            <th
                                className="p-4 font-medium cursor-pointer select-none"
                                onClick={() => setSortDesc((p) => !p)}
                            >
                                <span className="inline-flex items-center gap-1">
                                    Gross Pay
                                    <ArrowDownWideNarrow className={`h-3 w-3 transition-transform ${sortDesc ? '' : 'rotate-180'}`} />
                                </span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sorted.map((line) => {
                            const totalBonuses = line.attendanceBonusAmount + line.qaBonusAmount
                            return (
                                <tr key={line.agentId} className="border-b border-surface-border last:border-0 hover:bg-surface-muted/50">
                                    <td className="p-4 font-medium">{line.agentName}</td>
                                    <td className="p-4">{line.baseHours.toFixed(1)}</td>
                                    <td className="p-4">
                                        {line.overtimeHours.toFixed(1)}
                                        {line.overtimeHours > 0 && (
                                            <Badge variant="amber" className="ml-1">OT</Badge>
                                        )}
                                    </td>
                                    <td className="p-4">{currency(line.overtimeCost)}</td>
                                    <td className="p-4">{currency(line.nightDiffCost)}</td>
                                    <td className="p-4 text-status-red">
                                        {line.tardinessDeductionAmount > 0 ? `-${currency(line.tardinessDeductionAmount)}` : currency(0)}
                                    </td>
                                    <td className="p-4 text-status-green">{currency(totalBonuses)}</td>
                                    <td className="p-4 font-semibold">{currency(line.grossPay)}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                    <tfoot>
                        <tr className="border-t-2 border-surface-border bg-surface-muted font-semibold">
                            <td className="p-4">Total ({lines.length} agents)</td>
                            <td className="p-4">{totals.baseHours.toFixed(1)}</td>
                            <td className="p-4">{totals.otHours.toFixed(1)}</td>
                            <td className="p-4">{currency(totals.otCost)}</td>
                            <td className="p-4">{currency(totals.nightDiff)}</td>
                            <td className="p-4 text-status-red">-{currency(totals.deductions)}</td>
                            <td className="p-4 text-status-green">{currency(totals.bonuses)}</td>
                            <td className="p-4">{currency(totals.grossPay)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </Card>
    )
}
