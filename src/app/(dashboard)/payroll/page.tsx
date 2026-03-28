'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { useRole } from '@/hooks/useRole'
import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import { StatCard } from '@/components/molecules/StatCard'
import { Select } from '@/components/atoms/Select'
import { AiFeatureLock } from '@/components/molecules/AiFeatureLock'
import { PayrollSummaryTable } from '@/components/organisms/PayrollSummaryTable'
import type { PayrollLine } from '@/types/payroll'
import { Download, FileText, CheckCircle2 } from 'lucide-react'

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
        agentId: id, agentName: name, period: '2026-03',
        baseHours: base, overtimeHours: ot, overtimeRate: otRate,
        overtimeCost: parseFloat(otCost.toFixed(2)),
        nightDiffHours: nightH, nightDiffPremium: 0.15,
        nightDiffCost: parseFloat(nightCost.toFixed(2)),
        tardinessDeductionMinutes: tardMin,
        tardinessDeductionAmount: parseFloat(tardDeduct.toFixed(2)),
        paidLeaveDays: paidLeave, paidLeaveAmount: parseFloat(paidLeaveAmt.toFixed(2)),
        unpaidLeaveDays: unpaidLeave, attendanceBonusEligible: attBonus, attendanceBonusAmount: attBonusAmt,
        qaBonusEligible: qaBonus, qaBonusAmount: qaBonusAmt,
        grossPay: parseFloat(gross.toFixed(2)),
        clientAllocation: [{ clientId: client, percentage: 100, cost: parseFloat(gross.toFixed(2)) }],
    }
}

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

// ─── L1 — Own payroll ─────────────────────────────────────────────────────────
const AGENT_PAYSLIP_HISTORY = [
    { month: 'March 2026', scheduledH: 160, actualH: '158h 46m', ot: '0h', nightDiff: '4h at +15%', missingMin: 3, gross: 824.50, net: 781.20 },
    { month: 'February 2026', scheduledH: 160, actualH: '160h 00m', ot: '8h', nightDiff: '0h', missingMin: 0, gross: 891.30, net: 845.10 },
    { month: 'January 2026', scheduledH: 160, actualH: '158h 12m', ot: '4h', nightDiff: '0h', missingMin: 6, gross: 847.80, net: 803.50 },
]

function L1Payroll() {
    const [showInvoice, setShowInvoice] = useState(false)

    const handleDownload = () => {
        setShowInvoice(true)
        toast.success('Work Invoice PDF generated', { description: 'March 2026 Work Invoice ready for download.' })
    }

    return (
        <div className="space-y-5">
            {/* Own KPI cards */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatCard label="My Base Hours" value="158h 46m" variant="default" trendValue="Scheduled: 160h" />
                <StatCard label="My Overtime" value="0h" variant="default" trendValue="Blocked (missing min)" />
                <StatCard label="My Gross Pay" value="€824.50" variant="green" />
                <StatCard label="My Net Pay" value="€781.20" variant="green" />
            </div>

            {/* Work Invoice Card */}
            <Card className="border-green-200">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <FileText size={16} className="text-green-600" />
                            <h2 className="text-sm font-semibold">Work Invoice — March 2026</h2>
                        </div>
                        <p className="text-xs text-brand-gray">Agent #12 · Team A · Client A</p>
                    </div>
                    <Button onClick={handleDownload}>
                        <Download size={14} /> Download PDF
                    </Button>
                </div>

                {showInvoice && (
                    <div className="mt-4 rounded-xl border border-surface-border bg-surface-muted/30 p-4 space-y-3 text-sm">
                        <p className="font-semibold text-center text-base border-b border-surface-border pb-2">WORK INVOICE — March 2026</p>
                        <p className="text-xs text-center text-brand-gray">Agent #12 · Team A · Client A · meTru ERP-BPO</p>
                        <div className="space-y-1.5 text-xs">
                            {[
                                { label: 'Scheduled Hours', value: '160h 00m' },
                                { label: 'Actual Hours', value: '158h 46m' },
                                { label: 'OT Hours', value: '0h (blocked — missing min)' },
                                { label: 'Night Differential', value: '4h × +15% = €2.73' },
                                { label: 'Missing Minutes', value: '3 min — compensate mode (balance carried)' },
                                { label: 'Attendance Bonus', value: '€0 (blocked — 1 late arrival)' },
                                { label: 'QA Bonus', value: '€35 (QA ≥ 85%)' },
                                { label: '—', value: '' },
                                { label: 'Gross Pay', value: '€824.50', bold: true },
                                { label: 'Net Pay', value: '€781.20', bold: true },
                            ].map((r, i) =>
                                r.label === '—' ? <div key={i} className="border-t border-surface-border" /> : (
                                    <div key={i} className="flex justify-between gap-2">
                                        <span className="text-brand-gray">{r.label}</span>
                                        <span className={r.bold ? 'font-bold text-foreground' : ''}>{r.value}</span>
                                    </div>
                                )
                            )}
                        </div>
                        <div className="mt-3 flex justify-end">
                            <Button size="sm" variant="ghost" className="border border-surface-border" onClick={() => toast.info('PDF saved to downloads.')}>
                                <Download size={13} /> Save PDF
                            </Button>
                        </div>
                    </div>
                )}
            </Card>

            {/* Payslip History */}
            <Card padding={false}>
                <div className="border-b border-surface-border p-4">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-gray">Payslip History</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-surface-border text-left text-xs text-brand-gray">
                                <th className="p-3 font-medium">Month</th>
                                <th className="p-3 font-medium text-right">Scheduled h</th>
                                <th className="p-3 font-medium text-right">Actual</th>
                                <th className="p-3 font-medium text-right">OT</th>
                                <th className="p-3 font-medium text-right">Night Diff</th>
                                <th className="p-3 font-medium text-right">Missing Min</th>
                                <th className="p-3 font-medium text-right">Gross</th>
                                <th className="p-3 font-medium text-right">Net</th>
                                <th className="p-3 font-medium text-center">Invoice</th>
                            </tr>
                        </thead>
                        <tbody>
                            {AGENT_PAYSLIP_HISTORY.map((p) => (
                                <tr key={p.month} className="border-b border-surface-border last:border-0 hover:bg-surface-muted/50">
                                    <td className="p-3 font-medium">{p.month}</td>
                                    <td className="p-3 text-right">{p.scheduledH}h</td>
                                    <td className="p-3 text-right">{p.actualH}</td>
                                    <td className="p-3 text-right">{p.ot}</td>
                                    <td className="p-3 text-right">{p.nightDiff}</td>
                                    <td className="p-3 text-right">
                                        {p.missingMin > 0 ? <span className="text-status-amber">{p.missingMin} min</span> : <span className="text-status-green">0</span>}
                                    </td>
                                    <td className="p-3 text-right font-medium">€{p.gross.toFixed(2)}</td>
                                    <td className="p-3 text-right font-medium">€{p.net.toFixed(2)}</td>
                                    <td className="p-3 text-center">
                                        <Button size="sm" variant="ghost" className="border border-surface-border" onClick={() => toast.info(`Downloading ${p.month} invoice…`)}>
                                            <Download size={12} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Greyed Earnings Simulator */}
            <AiFeatureLock title="Earnings Simulator" description="What-if calculator: see how OT, bonuses, and deductions would affect your pay before the period ends" />
        </div>
    )
}

// ─── L2 — Hours only, NO EUR ──────────────────────────────────────────────────
const L2_HOURS = [
    { name: 'Agent #12', base: 158.8, ot: 0, night: 4, tardMin: -3, status: '⚠️ Missing min' },
    { name: 'Agent #7',  base: 176.0, ot: 0, night: 0, tardMin: -22, status: '⚠️ Missing min' },
    { name: 'Agent #22', base: 174.0, ot: 0, night: 0, tardMin: -15, status: '⚠️ Missing min' },
    { name: 'Agent #28', base: 176.0, ot: 8, night: 0, tardMin: 0, status: '✓ Complete' },
    { name: 'Agent #33', base: 176.0, ot: 4, night: 0, tardMin: 0, status: '✓ Complete' },
    { name: 'Alice Monroe', base: 176.0, ot: 8, night: 0, tardMin: 0, status: '✓ Complete' },
    { name: 'Ella Brooks', base: 168.0, ot: 0, night: 16, tardMin: 0, status: '✓ Complete' },
    { name: 'Frank Osei', base: 176.0, ot: 0, night: 0, tardMin: -12, status: '⚠️ Missing min' },
    { name: 'Grace Kim', base: 176.0, ot: 0, night: 0, tardMin: 0, status: '✓ Complete' },
    { name: 'Ryan Costa', base: 160.0, ot: 0, night: 0, tardMin: 0, status: '⚠️ NCNS day' },
]

function L2Payroll() {
    return (
        <div className="space-y-5">
            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 flex items-center gap-2 text-sm">
                <CheckCircle2 size={15} className="text-green-600 shrink-0" />
                <p className="text-green-700">
                    <strong>Level 2 — Hours Only.</strong> No EUR values, no rates, no gross/net pay, no cost allocation. Verify hours accuracy only.
                    Payroll calculation and approval is Finance Director (Level 4) authority.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatCard label="Agents Verified" value={L2_HOURS.filter(a => a.status === '✓ Complete').length} variant="green" trendValue={`of ${L2_HOURS.length}`} />
                <StatCard label="Missing Min Issues" value={L2_HOURS.filter(a => a.status.includes('Missing')).length} variant="amber" />
                <StatCard label="Total OT Hours" value={`${L2_HOURS.reduce((s, a) => s + a.ot, 0)}h`} variant="default" />
                <StatCard label="Total Night Hours" value={`${L2_HOURS.reduce((s, a) => s + a.night, 0)}h`} variant="default" />
            </div>

            <Card padding={false}>
                <div className="flex items-center justify-between border-b border-surface-border p-4">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-gray">Team Hours — March 2026</h2>
                    <span className="text-[10px] rounded border border-green-200 bg-green-50 px-2 py-0.5 text-green-700 font-medium">Hours only · NO EUR · NO rates · NO gross/net</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-surface-border text-left text-xs text-brand-gray">
                                <th className="p-3 font-medium">Agent</th>
                                <th className="p-3 font-medium text-right">Base Hours</th>
                                <th className="p-3 font-medium text-right">OT Hours</th>
                                <th className="p-3 font-medium text-right">Night Hours</th>
                                <th className="p-3 font-medium text-right">Tardiness</th>
                                <th className="p-3 font-medium text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {L2_HOURS.map((a) => (
                                <tr key={a.name} className="border-b border-surface-border last:border-0 hover:bg-surface-muted/50">
                                    <td className="p-3 font-medium">{a.name}</td>
                                    <td className="p-3 text-right">{a.base.toFixed(1)}</td>
                                    <td className="p-3 text-right">{a.ot > 0 ? <span className="font-medium">{a.ot}.0</span> : <span className="text-brand-gray">0</span>}</td>
                                    <td className="p-3 text-right">{a.night > 0 ? <span className="font-medium">{a.night}.0</span> : <span className="text-brand-gray">0</span>}</td>
                                    <td className="p-3 text-right">
                                        {a.tardMin < 0 ? (
                                            <span className="font-medium text-status-amber">{Math.abs(a.tardMin)} min</span>
                                        ) : <span className="text-brand-gray">—</span>}
                                    </td>
                                    <td className="p-3 text-center">
                                        <Badge variant={a.status.startsWith('✓') ? 'green' : 'amber'}>{a.status}</Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="border-t border-surface-border bg-surface-muted/20 p-3 text-xs text-brand-gray">
                    Verify hours accuracy only. Gross pay, net pay, rates, and cost allocation are visible to Finance Director (Level 4) and above.
                </div>
            </Card>
        </div>
    )
}

// ─── L3+ Full Payroll ─────────────────────────────────────────────────────────
const periods = [
    { value: '2026-03', label: 'March 2026' },
    { value: '2026-02', label: 'February 2026' },
]

function FullPayroll() {
    const [period, setPeriod] = useState('2026-03')
    const [approvalStatus, setApprovalStatus] = useState<'pending' | 'approved'>('pending')

    const totalGross = mockLines.reduce((s, l) => s + l.grossPay, 0)
    const totalOt = mockLines.reduce((s, l) => s + l.overtimeCost, 0)
    const totalDeductions = mockLines.reduce((s, l) => s + l.tardinessDeductionAmount, 0)
    const totalNightDiff = mockLines.reduce((s, l) => s + l.nightDiffCost, 0)

    return (
        <div className="space-y-5">
            <div className="flex items-center gap-3 flex-wrap">
                <Select options={periods} value={period} onChange={(e) => setPeriod(e.target.value)} className="w-44" />
                {approvalStatus === 'pending' ? (
                    <Button onClick={() => { setApprovalStatus('approved'); toast.success('Payroll approved', { description: 'March 2026 payroll approved. Exported to ADP.' }) }}>
                        One-Click Approve
                    </Button>
                ) : (
                    <Badge variant="green">✓ Approved — Exported to ADP</Badge>
                )}
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatCard label="Total Gross" value={`€${totalGross.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
                <StatCard label="Total OT Cost" value={`€${totalOt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} variant="amber" />
                <StatCard label="Night Differential" value={`€${totalNightDiff.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
                <StatCard label="Tardiness Deductions" value={`€${totalDeductions.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} variant="red" />
            </div>

            <PayrollSummaryTable lines={mockLines} />
            <AiFeatureLock title="Earnings Simulator" description="What-if calculator for agents to preview OT, bonus, and deduction scenarios" />
        </div>
    )
}

// ─── Page root ────────────────────────────────────────────────────────────────
export default function PayrollPage() {
    const { level } = useRole()

    const subtitle =
        level === 1 ? 'My base hours · my overtime · my gross pay · my net pay · Work Invoice PDF'
        : level === 2 ? 'Hours only — no EUR values, no rates, no gross/net pay'
        : 'Full payroll — gross/net pay, OT costs, deductions, client allocation'

    return (
        <div className="space-y-1">
            <div className="mb-4">
                <h1 className="text-xl font-bold tracking-tight">Payroll</h1>
                <p className="text-sm text-brand-gray">{subtitle}</p>
            </div>
            {level === 1 ? <L1Payroll /> : level === 2 ? <L2Payroll /> : <FullPayroll />}
        </div>
    )
}
