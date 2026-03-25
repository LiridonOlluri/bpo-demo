'use client'

import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import { ProgressBar } from '@/components/atoms/ProgressBar'
import type { ShrinkageCategory } from '@/types/shrinkage'

interface ShrinkageBreakdownProps {
    categories: ShrinkageCategory[]
}

export function ShrinkageBreakdown({ categories }: ShrinkageBreakdownProps) {
    const planned = categories
        .filter((c) => c.type === 'planned' && c.isActive)
        .sort((a, b) => b.percentage - a.percentage)

    const unplanned = categories
        .filter((c) => c.type === 'unplanned' && c.isActive)
        .sort((a, b) => b.percentage - a.percentage)

    const totalPlanned = planned.reduce((sum, c) => sum + c.percentage, 0)
    const totalUnplanned = unplanned.reduce((sum, c) => sum + c.percentage, 0)
    const totalShrinkage = totalPlanned + totalUnplanned

    return (
        <Card>
            <div className="space-y-6">
                <Section title="Planned Shrinkage" items={planned} total={totalPlanned} />
                <Section title="Unplanned Shrinkage" items={unplanned} total={totalUnplanned} />

                <div className="border-t border-surface-border pt-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold">Total Shrinkage</span>
                        <span className="text-sm font-bold">{totalShrinkage.toFixed(1)}%</span>
                    </div>
                    <ProgressBar value={totalShrinkage} max={100} variant={totalShrinkage > 35 ? 'red' : totalShrinkage > 25 ? 'amber' : 'green'} />
                </div>
            </div>
        </Card>
    )
}

function Section({ title, items, total }: { title: string; items: ShrinkageCategory[]; total: number }) {
    return (
        <div>
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">{title}</h3>
                <span className="text-xs text-brand-gray">{total.toFixed(1)}%</span>
            </div>
            <div className="space-y-3">
                {items.map((cat) => (
                    <div key={cat.id}>
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                                <span className="text-xs">{cat.name}</span>
                                {cat.isMoveable && <Badge variant="blue">Moveable</Badge>}
                            </div>
                            <span className="text-xs font-medium">{cat.percentage.toFixed(1)}%</span>
                        </div>
                        <ProgressBar
                            value={cat.percentage}
                            max={50}
                            variant={cat.type === 'planned' ? 'blue' : 'amber'}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}
