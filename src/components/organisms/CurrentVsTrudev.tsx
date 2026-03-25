'use client'

import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import { X, ArrowRight } from 'lucide-react'

interface CurrentVsTrudevProps {
    isOpen: boolean
    onClose: () => void
}

const comparisons = [
    { area: 'Staffing Calculator', current: 'Spreadsheets / Erlang Excel', trudev: 'Built-in Erlang C with live inputs' },
    { area: 'Attendance Tracking', current: 'Manual timesheets + ACD pulls', trudev: 'Real-time grid with auto clock-in' },
    { area: 'FTE Loss Monitoring', current: 'Not tracked / monthly review', trudev: 'Live FTE Loss engine per category' },
    { area: 'Productivity Tickets', current: 'Email chains / verbal escalation', trudev: 'Auto-triggered with root cause' },
    { area: 'Leave Management', current: 'Shared calendar / no capacity gate', trudev: 'Capacity gating + smart push' },
    { area: 'Bradford Factor', current: 'Annual HR review', trudev: 'Rolling 12-month with pattern detection' },
    { area: 'Schedule Optimisation', current: 'Static shift templates', trudev: 'Dynamic breaks + interval staffing' },
    { area: 'Payroll Calculation', current: 'Manual OT/deduction tracking', trudev: 'Auto-computed from attendance data' },
]

export function CurrentVsTrudev({ isOpen, onClose }: CurrentVsTrudevProps) {
    if (!isOpen) return null
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <Card className="relative max-h-[80vh] w-full max-w-3xl overflow-y-auto">
                <button onClick={onClose} className="absolute right-4 top-4 text-brand-gray hover:text-foreground">
                    <X size={20} />
                </button>
                <h2 className="text-xl font-bold mb-4">Current Tools vs TruDev BPO</h2>
                <div className="space-y-3">
                    {comparisons.map((c) => (
                        <div key={c.area} className="flex items-center gap-4 rounded-lg border border-surface-border p-3">
                            <div className="flex-1">
                                <p className="text-xs font-medium text-brand-gray uppercase tracking-wider">{c.area}</p>
                                <div className="flex items-center gap-3 mt-1">
                                    <div className="flex-1">
                                        <Badge variant="red">Current</Badge>
                                        <p className="mt-1 text-sm">{c.current}</p>
                                    </div>
                                    <ArrowRight size={16} className="text-brand-gray shrink-0" />
                                    <div className="flex-1">
                                        <Badge variant="green">TruDev</Badge>
                                        <p className="mt-1 text-sm font-medium">{c.trudev}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    )
}
