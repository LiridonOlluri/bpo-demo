'use client'

import { Card } from '@/components/atoms/Card'
import { ProgressBar } from '@/components/atoms/ProgressBar'
import { StatCard } from '@/components/molecules/StatCard'
import { cn } from '@/lib/utils'
import type { FteLossTeamSummary } from '@/types/fteLoss'

interface FteLossWidgetProps {
    data: FteLossTeamSummary
}

function lossVariant(pct: number): 'red' | 'amber' | 'green' {
    if (pct > 30) return 'red'
    if (pct > 20) return 'amber'
    return 'green'
}

function trendDirection(trend: FteLossTeamSummary['trend']): 'up' | 'down' | 'flat' {
    if (trend === 'improving') return 'up'
    if (trend === 'worsening') return 'down'
    return 'flat'
}

export function FteLossWidget({ data }: FteLossWidgetProps) {
    const variant = lossVariant(data.lossPercentage)

    return (
        <div className="space-y-6">
            {/* Top KPIs */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <StatCard label="Nominal FTEs" value={data.nominalFtes} />
                <StatCard label="Effective FTEs" value={data.effectiveFtes} />
                <StatCard
                    label="Loss %"
                    value={`${data.lossPercentage.toFixed(1)}%`}
                    variant={variant}
                    trend={trendDirection(data.trend)}
                    trendValue={data.trend}
                />
                <StatCard
                    label="Daily Cost Impact"
                    value={`€${data.dailyCostImpact.toLocaleString()}`}
                    variant={variant}
                />
            </div>

            {/* Category breakdown */}
            <Card>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-gray">
                    Loss Breakdown
                </h3>
                <div className="space-y-4">
                    {data.categories
                        .sort((a, b) => a.priority - b.priority)
                        .map((cat) => {
                            const barVariant = lossVariant(cat.percentageOfNominal * (100 / (data.lossPercentage || 1)) * data.lossPercentage / 100 * 100)
                            return (
                                <div key={cat.category}>
                                    <div className="mb-1 flex items-center justify-between text-sm">
                                        <span className="font-medium">{cat.label}</span>
                                        <span className={cn(
                                            'font-semibold',
                                            cat.percentageOfNominal > 10 && 'text-status-red',
                                            cat.percentageOfNominal > 5 && cat.percentageOfNominal <= 10 && 'text-status-amber',
                                            cat.percentageOfNominal <= 5 && 'text-foreground',
                                        )}>
                                            {cat.fteLost.toFixed(1)} FTE
                                        </span>
                                    </div>
                                    <ProgressBar
                                        value={cat.percentageOfNominal}
                                        max={data.lossPercentage || 100}
                                        variant={barVariant}
                                    />
                                </div>
                            )
                        })}
                </div>
            </Card>
        </div>
    )
}
