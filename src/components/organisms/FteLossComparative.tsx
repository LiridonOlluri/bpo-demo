'use client'

import { Card } from '@/components/atoms/Card'
import { Badge } from '@/components/atoms/Badge'
import { StatCard } from '@/components/molecules/StatCard'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { FteLossTeamSummary } from '@/types/fteLoss'

interface FteLossComparativeProps {
    teams: FteLossTeamSummary[]
}

function lossVariant(pct: number): 'green' | 'amber' | 'red' {
    if (pct < 15) return 'green'
    if (pct <= 30) return 'amber'
    return 'red'
}

const trendMap = {
    improving: { icon: TrendingUp, label: 'Improving', badge: 'green' as const },
    stable: { icon: Minus, label: 'Stable', badge: 'grey' as const },
    worsening: { icon: TrendingDown, label: 'Worsening', badge: 'red' as const },
}

export function FteLossComparative({ teams }: FteLossComparativeProps) {
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">FTE Loss — Team Comparison</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {teams.map((team) => {
                    const variant = lossVariant(team.lossPercentage)
                    const trend = trendMap[team.trend]
                    const TrendIcon = trend.icon

                    return (
                        <Card key={team.teamId} className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold">{team.teamName}</h3>
                                <Badge variant={trend.badge}>
                                    <span className="inline-flex items-center gap-1">
                                        <TrendIcon size={12} />
                                        {trend.label}
                                    </span>
                                </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <StatCard
                                    label="Nominal FTEs"
                                    value={team.nominalFtes.toFixed(1)}
                                    variant="default"
                                />
                                <StatCard
                                    label="Effective FTEs"
                                    value={team.effectiveFtes.toFixed(1)}
                                    variant={variant}
                                />
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-brand-gray">Loss %</span>
                                <Badge variant={variant}>{team.lossPercentage.toFixed(1)}%</Badge>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-brand-gray">Daily Cost Impact</span>
                                <span className="font-medium text-status-red">
                                    €{team.dailyCostImpact.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            </div>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
